import crypto from 'node:crypto';
import { LoginDTO,RegisterDTO } from '../dto/access.dto';
import { BadRequestError, AuthFailureError, ForbiddenError } from '../core/error.response';
import { createTokenPair } from '../auth/authUtils';
import KeyTokenService from './keyToken.service';
import { getInfoData } from '../shared/utils';
import { prisma,pg } from '../database/init.postgresql';
import { IKeyToken } from './keyToken.service';
import { IdecodeUser } from '../middlewares/authentication.middleware';

enum RoleShop{
    SHOP = 'SHOP',
    WRITER = 'WRITER',
    EDITOR = 'EDITOR',
    ADMIN = 'ADMIN'
}

class AccessService{
    private static generateKeyPair(){
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa',{
            modulusLength:4096,
            publicKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            },
            privateKeyEncoding:{
                type:'pkcs1',
                format:'pem'
            }
        })
        return {publicKey, privateKey}
    }

    //when resolve, value of type will be string
    private static hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    private static async findShop( email: string ){
        return await prisma.shop.findFirst({
            where: {
                email: email
            }})
    };

    static handleRefreshToken = async( keyStore: IKeyToken, user: IdecodeUser, refreshToken: string )=>{
        /**
         * 1 check wheather user's token been used or not, if been used, remove key and for them to relogin
         * 2 if user's token is not valid token, force them to relogin, too
         * 3 if this accesstoken is valid, create new accesstoken, refreshtoken
         * 4 update keytoken in database
        */

        //1
        console.log('keystore',keyStore)
        const {userId, email} = user;
        if(keyStore.refreshTokensUsed!.includes(refreshToken)){
            await KeyTokenService.removeKeyByUUID(userId)
            throw new ForbiddenError('Something wrong happended, please relogin')
        }

        //2
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundShop = await this.findShop(email)
        if(!foundShop) throw new AuthFailureError('shop not registed');

        //3
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = await createTokenPair({userId,email},publicKey,privateKey)

        //4
        const updateQuery = `
        UPDATE "key_tokens"
        SET "publicKey" = $1,
            "refreshToken" = $2,
            "refreshTokensUsed" = array_append("refreshTokensUsed", $3)
        WHERE "userId" = $4
        `;
        await pg.query(updateQuery, [publicKey, tokens.refreshToken, refreshToken, userId]);
   
        return {
            user,
            tokens  
        }
    };

    static async logout ( keyStore: IKeyToken ){
        const delKey = await KeyTokenService.removeKeyByUUID(keyStore.userId );
        return delKey 
    };

    static async login(login: LoginDTO){
        const foundShop = await this.findShop(login.email);
        if(!foundShop) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundShop.salt);
        if (passwordHashed !== foundShop.password) throw new AuthFailureError('Wrong password!!!');

        
        const { publicKey, privateKey } = this.generateKeyPair();
        const { id:userId } = foundShop;
        const tokens = await createTokenPair({userId: foundShop.uuid,email: login.email}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({  
            userId: foundShop.uuid,
            publicKey,
            refreshToken:tokens.refreshToken,
        })

        //5
        return{
            shop:getInfoData(['uuid','email'],foundShop),
            tokens
        }
    }

    static async register(register: RegisterDTO){
        const shopHolder = await this.findShop(register.email);
        if(shopHolder) throw new BadRequestError('Shop already existed');

        const salt = crypto.randomBytes(32).toString('hex')
        const passwordHashed = await this.hashPassword(register.password, salt)

        const newShop = await prisma.shop.create({
            data:{
                name: register.name,
                salt,
                email: register.email,
                password:passwordHashed,
                roles:RoleShop.SHOP
            }
        })

        if(newShop){
            const { publicKey, privateKey } = this.generateKeyPair();
            const tokens = await createTokenPair({userId:newShop.uuid, email: newShop.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop.uuid,
                publicKey:publicKey,
                refreshToken:tokens.refreshToken
            })
            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                shop:getInfoData(['uuid','email'],newShop),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }
    }
}

export default AccessService