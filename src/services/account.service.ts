import crypto from 'node:crypto';
import { prisma,pg } from "../database/init.postgresql";
import { ShopRegisterDTO, ShopLoginDTO } from "../dto/shop.dto";
import { UserRegisterDTO, UserLoginDTO } from "../dto/user.dto";
import { getInfoData } from "../shared/utils";
import KeyTokenService from './keytoken.service';
import { BadRequestError, AuthFailureError, ForbiddenError } from "../core/error.response";
import { JsonWebToken } from '../auth/authUtils';
import { RoleShop, IAccountBase } from '../shared/interface/account.interface';
import { KeyToken } from '../shared/interface/keyToken.interface';
import { JWTdecode } from '../shared/interface/jwt.interface';

/**
 * 
 * this is abstract factory design pattern
 * abstract factory pattern is perfect fit to made something similarly about logic
 * in this situation, I create user and shop at the same time
 * both of them have same functionality in account service like login, logout, etc  
 * and they have same functionality in keytoken like find keytoken, delete keytoken
 * at the beginning, I intend to use this pattern because it is perfect fit for my scenarior
 * but after that, I realize that we just need one keytoken table for all kind of account
 * that why this implementation look so weird, but because this is my personal project
 * and I learn from this project, that's why I will use abstract factory pattern for account
 * and method factory factory for product
 * of course later on, I will deploy SKU, SPU, which doesnt use method factory pattern anymore
 * after change business logic code, method factory pattern would be better fit for account service
 */



/**
 * image method factory like one-dimension array
 * abstract factory, like two-dimension array
 * 
 * method factory deploy good fit for create N number of object with same funciton nality
 * abstract factory deploy good fit for create N serial of object with same functionality and within same step
*/
// all account have this bunch of method
interface IAccount {
    handleRefreshToken(keyStore: KeyToken, jwt: JWTdecode, refreshToken: string):Promise<void> |{};
    login(data: IAccountBase):Promise <void>| {};
    register(data: IAccountBase):Promise <void> | {};
    logout(keyStore: KeyToken):Promise <void> | {};
}

//interface for abstract factory
interface AbstractFactory {
    createAccount(): IAccount;
}

class ShopFactory implements AbstractFactory {

    public createAccount(): IAccount {
        return new ShopAccount();
    }

}

class UserFactory implements AbstractFactory {

    public createAccount(): IAccount {
        return new UserAccount();
    }

}

abstract class AccountFactory{
    protected hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    protected generateKeyPair(){
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

    protected find(modelName: 'shop' | 'user', find: string){
        return (prisma as any)[modelName].findFirst({
            where: {email:find},
        });
    }

    protected createKeyToken( accountId: string, publicKey: string, refreshToken: string, roles: "SHOP"| "USER"){
        KeyTokenService.createKeyToken( {accountId, publicKey, refreshToken, roles} )
    }

}

class ShopAccount extends AccountFactory implements IAccount  {

    async handleRefreshToken( keyStore: KeyToken, account: JWTdecode, refreshToken: string ){
        //1 check wheather user's token been used or not, if been used, remove key and for them to relogin
        const {accountId, email} = account;

        const duplicateJWT = await prisma.refreshTokenUsed.findFirst({
            where:{
                token: refreshToken
            }
        })

        if(duplicateJWT) throw new ForbiddenError('Something wrong happended, please relogin')

        //2 if user's token is not valid token, force them to relogin, too
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundShop = await this.find("shop",email)
        if(!foundShop) throw new AuthFailureError('shop not registed');

        //3 if this accesstoken is valid, create new accesstoken, refreshtoken
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = JsonWebToken.createToken({accountId: accountId,email, role: 'shop'},publicKey,privateKey)

        const update = await prisma.keyToken.update({
            where:{
                accountId: account.accountId
            },
            data:{
                publicKey,
                refreshToken: tokens.refreshToken
            }
        })

        const createUsedToken = await prisma.refreshTokenUsed.create({
            data:{
                token:refreshToken,
                keyTokenId: update.id
            }
        })

        return {
            tokens,
            update,
            createUsedToken
        }
    };

    async logout ( keyStore: KeyToken ){
        const delKey = await KeyTokenService.removeKeyByAccountID(keyStore.accountId );
        return delKey
    };

    async login(login: ShopLoginDTO){
        const foundShop = await this.find("shop",login.email);
        if(!foundShop) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundShop.salt);
        if (passwordHashed !== foundShop.password) throw new AuthFailureError('Wrong password!!!');

        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = JsonWebToken.createToken({accountId: foundShop.id,email: login.email, role: 'shop'}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            accountId: foundShop.id,
            publicKey,
            refreshToken:tokens.refreshToken,
            roles: "SHOP"
        })

        return{
            shop:getInfoData(['uuid','email'],foundShop),
            tokens
        }
    }

    async register(register: ShopRegisterDTO) {
        const shopHolder = await this.find("shop",register.email);
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
            const tokens = JsonWebToken.createToken({
                accountId:newShop.id,
                email: newShop.email,
                role: 'shop'
            },
                publicKey,
                privateKey
            );

            if(!tokens)throw new BadRequestError('create tokens error!!!!!!');

            const keyStore = await KeyTokenService.createKeyToken({
                accountId: newShop.id,
                publicKey:publicKey,
                refreshToken:tokens.refreshToken,
                roles: "SHOP"
            });

            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                shop:getInfoData(['id','email',],newShop),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }
    }
}

// UserAccount.ts
class UserAccount extends AccountFactory implements IAccount {
    async handleRefreshToken( keyStore: KeyToken, account: JWTdecode, refreshToken: string ){
        //1 check wheather user's token been used or not, if been used, remove key and for them to relogin
        const {accountId, email} = account;

        const duplicateJWT = await prisma.refreshTokenUsed.findFirst({
            where:{
                token: refreshToken
            }
        })

        if(duplicateJWT) throw new ForbiddenError('Something wrong happended, please relogin')

        //2 if user's token is not valid token, force them to relogin, too
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundUser = await this.find("user",email)
        if(!foundUser) throw new AuthFailureError('shop not registed');

        //3 if this accesstoken is valid, create new accesstoken, refreshtoken
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = JsonWebToken.createToken({accountId: accountId,email, role: 'user'},publicKey,privateKey)

        const update = await prisma.keyToken.update({
            where:{
                accountId: account.accountId
            },
            data:{
                publicKey,
                refreshToken: tokens.refreshToken
            }
        })

        const createUsedToken = await prisma.refreshTokenUsed.create({
            data:{
                token:refreshToken,
                keyTokenId: update.id
            }
        })

        return {
            tokens,
            update,
            createUsedToken
        }
    };

    async logout ( keyStore: KeyToken ){
        const delKey = await KeyTokenService.removeKeyByAccountID(keyStore.accountId );
        return delKey 
    };

    async login(login: UserRegisterDTO) {
        const foundUser = await this.find("user",login.email);
        if(!foundUser) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundUser.salt);
        if (passwordHashed !== foundUser.password) throw new AuthFailureError('Wrong password!!!');

        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = JsonWebToken.createToken({accountId: foundUser.id,email: login.email, role: 'user'}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            accountId: foundUser.id,
            publicKey,
            refreshToken:tokens.refreshToken,
            roles: "USER"
        })

        return{
            shop:getInfoData(['uuid','email'],foundUser),
            tokens
        }
    }

    async register(register: UserRegisterDTO) {
        const userHolder = await this.find("user",register.email);
        if(userHolder) throw new BadRequestError('User already existed');

        const salt = crypto.randomBytes(32).toString('hex')
        const passwordHashed = await this.hashPassword(register.password, salt)

        const newUser = await prisma.user.create({
            data:{
                name: register.name,
                salt,
                email: register.email,
                password:passwordHashed,
                phone: register.phone,
                sex: register.sex,
                avatar: register.avatar,
                dateOfBirth: register.dateOfBirth
            }
        })

        if(newUser){
            const { publicKey, privateKey } = this.generateKeyPair();
            const tokens = JsonWebToken.createToken({accountId:newUser.id, email: newUser.email, role: 'user'},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')
            const keyStore = await KeyTokenService.createKeyToken({
                accountId: newUser.id,
                publicKey:publicKey,
                refreshToken:tokens.refreshToken,
                roles: "USER"
            })
            if(!keyStore) throw new Error('cannot generate keytoken');

            return{
                shop:getInfoData(['id','email',],newUser),
                tokens
            }
        }
        return {
            code:200,
            metadata:null
        }  
    }
}

function clientCode(factory: AbstractFactory) {
    const account = factory.createAccount();
    return { account };
}

export const user = clientCode(new UserFactory());
export const shop = clientCode(new ShopFactory());
