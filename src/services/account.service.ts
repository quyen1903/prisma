import crypto from 'node:crypto';
import { prisma,pg } from "../database/init.postgresql";
import { ShopRegisterDTO, ShopLoginDTO } from "../dto/shop.dto";
import { UserRegisterDTO, UserLoginDTO } from "../dto/user.dto";
import { getInfoData } from "../shared/utils";
import { BadRequestError, AuthFailureError, NotFoundError, ForbiddenError } from "../core/error.response";
import { JsonWebToken } from '../auth/authUtils';
import { RoleShop, IAccountBase } from '../shared/interface/account.interface';
import { KeyToken } from '../shared/interface/keyToken.interface';
import { Decode } from '../shared/interface/decode.interface';

interface IAccount {
    login(data: IAccountBase):Promise <void>| {};
    register(data: IAccountBase):Promise <void> | {};
    logout(keyStore: KeyToken):Promise <void> | {};
}

interface IShopAccount extends IAccount{
    handleRefreshToken(keyStore: KeyToken, user: Decode, refreshToken: string):Promise<void> |{};
}

interface IToken {
    createKeyToken({ publicKey , refreshToken }: KeyToken): Promise<{}>;
    findByAccountId(data: string): Promise<any> | {}
}

interface AbstractFactory {
    createAccount(): IAccount;
    createToken(): IToken
}

class ShopFactory implements AbstractFactory {
    public createAccount(): IShopAccount {
        return new ShopAccount();
    }

    public createToken(): IToken {
        return new ShopToken();
    }
}

class UserFactory implements AbstractFactory {
    public createAccount(): IAccount {
        return new UserAccount();
    }

    public createToken(): IToken {
        return new UserToken();
    }
}


class AccountFactory{
    hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    generateKeyPair(){
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

    async find(modelName: 'shop' | 'user' | 'product', whereClause: any){
        return (prisma as any)[modelName].findFirst({
            where: {email:whereClause},
          });
        
    }

    shopTokenService(){
        return new ShopToken()
    }
    async findUser( email: string ){
        return await prisma.user.findFirst({
            where: { email: email}
        })
    };

    userTokenService(){
        return new UserToken()
    }

}

class ShopAccount extends AccountFactory implements IShopAccount  {

    async handleRefreshToken( keyStore: KeyToken, shop: Decode, refreshToken: string ){
        //1 check wheather user's token been used or not, if been used, remove key and for them to relogin
        const {accountId, email} = shop;
        const shopToken = new ShopToken();
        if(keyStore.refreshTokensUsed!.includes(refreshToken)){
            await shopToken.removeKeyByUUID(accountId)
            throw new ForbiddenError('Something wrong happended, please relogin')
        }

        //2 if user's token is not valid token, force them to relogin, too
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundShop = await this.find("shop",email)
        if(!foundShop) throw new AuthFailureError('shop not registed');

        //3 if this accesstoken is valid, create new accesstoken, refreshtoken
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = JsonWebToken.createToken({accountId: accountId,email},publicKey,privateKey)

        //4 update keytoken in database
        const updateQuery = `
        UPDATE "key_tokens"
        SET "publicKey" = $1,
            "refreshToken" = $2,
            "refreshTokensUsed" = array_append("refreshTokensUsed", $3)
        WHERE "shopId" = $4
        `;
        await pg.query(updateQuery, [publicKey, tokens.refreshToken, refreshToken, accountId]);
        return {
            shop,
            tokens  
        }
    };

    async logout ( keyStore: KeyToken ){
        const shopTokenService = this.shopTokenService();        
        const delKey = await shopTokenService.removeKeyByUUID(keyStore.accountId );
        return delKey 
    };

    async login(login: ShopLoginDTO){
        const foundShop = await this.find("shop",login.email);
        if(!foundShop) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundShop.salt);
        if (passwordHashed !== foundShop.password) throw new AuthFailureError('Wrong password!!!');

        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = JsonWebToken.createToken({accountId: foundShop.id,email: login.email}, publicKey, privateKey);

        const shopTokenService = this.shopTokenService();
        await shopTokenService.createKeyToken({
            accountId: foundShop.id,
            publicKey,
            refreshToken:tokens.refreshToken,
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
            const tokens = JsonWebToken.createToken({accountId:newShop.id, email: newShop.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')
            const shopTokenService = this.shopTokenService();
            const keyStore = await shopTokenService.createKeyToken({
                accountId: newShop.id,
                publicKey:publicKey,
                refreshToken:tokens.refreshToken
            })
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
    async logout ( keyStore: KeyToken ){
        const userTokenService = this.userTokenService();        
        const delKey = await userTokenService.removeKeyByUUID(keyStore.accountId );
        return delKey 
    };

    async login(login: UserRegisterDTO) {
        const foundUser = await this.find("user",login.email);
        if(!foundUser) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundUser.salt);
        if (passwordHashed !== foundUser.password) throw new AuthFailureError('Wrong password!!!');

        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = JsonWebToken.createToken({accountId: foundUser.id,email: login.email}, publicKey, privateKey);

        const shopTokenService = this.shopTokenService();
        await shopTokenService.createKeyToken({
            accountId: foundUser.id,
            publicKey,
            refreshToken:tokens.refreshToken,
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
            const tokens = JsonWebToken.createToken({accountId:newUser.id, email: newUser.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')
            const userTokenService = this.userTokenService();
            const keyStore = await userTokenService.createKeyToken({
                accountId: newUser.id,
                publicKey:publicKey,
                refreshToken:tokens.refreshToken
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

abstract class BaseToken<T> {
    protected abstract model: any;

    async createKeyToken({ accountId, publicKey, refreshToken }: { accountId: string; publicKey: string; refreshToken: string }) {
        return await this.model.upsert({
            where: { accountId },
            update: { publicKey, refreshToken },
            create: { accountId, publicKey, refreshToken },
        });
    }

    async findByAccountId(accountId: string) {
        return await this.model.findFirst({
            where: { accountId },
        });
    }

    async removeKeyByUUID(accountId: string) {
        const keyToken = await this.model.findFirst({
            where: { accountId },
        });

        if (keyToken) {
            return await this.model.delete({
                where: { id: keyToken.id },
            });
        } else {
            throw new Error("KeyToken not found");
        }
    }

    async findByRefreshTokenUsed(refreshToken: string) {
        return await this.model.findFirst({
            where: {
                refreshTokensUsed: { has: refreshToken },
            },
        });
    }

    async findByRefreshToken(refreshToken: string) {
        return await this.model.findFirst({
            where: { refreshToken },
        });
    }
}

class ShopToken extends BaseToken<any> implements IToken{
    protected model = prisma.shopKeyToken;
}

class UserToken extends BaseToken<any> implements IToken{
    protected model = prisma.userKeyToken;
}

function clientCode(factory: AbstractFactory) {
    const account = factory.createAccount();
    const token = factory.createToken();
    return { account, token };
}


export const user = clientCode(new UserFactory());
export const shop = clientCode(new ShopFactory()) as { account: IShopAccount; token: IToken };
