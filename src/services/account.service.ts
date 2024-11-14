import crypto from 'node:crypto';
import { prisma,pg } from "../database/init.postgresql";
import { ShopRegisterDTO, ShopLoginDTO } from "../dto/shop.dto";
import { UserRegisterDTO, UserLoginDTO } from "../dto/user.dto";
import { getInfoData } from "../shared/utils";
import { BadRequestError, AuthFailureError, NotFoundError, ForbiddenError } from "../core/error.response";
import { JsonWebToken } from '../auth/authUtils';
import { RoleShop, IAccountBase } from '../shared/interface/account.interface';
import { KeyToken, ShopKeyToken, UserKeyToken } from '../shared/interface/keyToken.interface';
import { Decode, ShopDecode, UserDecode } from '../shared/interface/decode.interface';

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
    findByAccountId(data: string): Promise<{} | null>
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

class ShopAccount implements IShopAccount {
    private async findShop( email: string ){
        return await prisma.shop.findFirst({
            where: { email: email}
        })
    };

    
    private hashPassword(password:string, salt:string):Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(password, salt, 100,64,'sha512', (err, key) => {
                if (err) return  reject(err)
                resolve(key.toString('hex'));
            })
        });
    }

    private generateKeyPair(){
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

    private shopTokenService(){
        return new ShopToken()
    }

    async handleRefreshToken( keyStore: ShopKeyToken, shop: ShopDecode, refreshToken: string ){
        //1 check wheather user's token been used or not, if been used, remove key and for them to relogin
        const {shopId, email} = shop;
        const shopToken = new ShopToken();
        if(keyStore.refreshTokensUsed!.includes(refreshToken)){
            await shopToken.removeKeyByUUID(shopId)
            throw new ForbiddenError('Something wrong happended, please relogin')
        }

        //2 if user's token is not valid token, force them to relogin, too
        if(keyStore.refreshToken !== refreshToken)throw new AuthFailureError('something was wrong happended, please relogin')
        const foundShop = await this.findShop(email)
        if(!foundShop) throw new AuthFailureError('shop not registed');

        //3 if this accesstoken is valid, create new accesstoken, refreshtoken
        const { publicKey, privateKey } = this.generateKeyPair()
        const tokens = JsonWebToken.createShoptoken({shopId,email},publicKey,privateKey)

        //4 update keytoken in database
        const updateQuery = `
        UPDATE "key_tokens"
        SET "publicKey" = $1,
            "refreshToken" = $2,
            "refreshTokensUsed" = array_append("refreshTokensUsed", $3)
        WHERE "shopId" = $4
        `;
        await pg.query(updateQuery, [publicKey, tokens.refreshToken, refreshToken, shopId]);
        return {
            shop,
            tokens  
        }
    };

    async logout ( keyStore: ShopKeyToken ){
        const shopTokenService = this.shopTokenService();        
        const delKey = await shopTokenService.removeKeyByUUID(keyStore.shopId );
        return delKey 
    };

    async login(login: ShopLoginDTO){
        const foundShop = await this.findShop(login.email);
        if(!foundShop) throw new BadRequestError('Shop not registed');

        const passwordHashed =await this.hashPassword(login.password, foundShop.salt);
        if (passwordHashed !== foundShop.password) throw new AuthFailureError('Wrong password!!!');

        const { publicKey, privateKey } = this.generateKeyPair();
        const tokens = JsonWebToken.createShoptoken({shopId: foundShop.id,email: login.email}, publicKey, privateKey);
        const shopTokenService = this.shopTokenService();
        await shopTokenService.createKeyToken({
            shopId: foundShop.id,
            publicKey,
            refreshToken:tokens.refreshToken,
        })

        return{
            shop:getInfoData(['uuid','email'],foundShop),
            tokens
        }
    }

    async register(register: ShopRegisterDTO) {
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
            const tokens = JsonWebToken.createShoptoken({shopId:newShop.id, email: newShop.email},publicKey, privateKey)
            if(!tokens)throw new BadRequestError('create tokens error!!!!!!')
            const shopTokenService = this.shopTokenService();
            const keyStore = await shopTokenService.createKeyToken({
                shopId: newShop.id,
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
class UserAccount implements IAccount {
    async login(data: UserRegisterDTO) { }
    async register(data: UserLoginDTO) { /* User-specific registration */ }
    async logout(data: UserKeyToken) { /* User-specific logout */ }
}

// ShopToken.ts
class ShopToken implements IToken {
    async createKeyToken({ shopId, publicKey , refreshToken }: ShopKeyToken) {
        const result =  await prisma.shopKeyToken.upsert ({
            where: { shopId },
            update: { publicKey, refreshToken }, // If it exists, update the record
            create: { shopId, publicKey, refreshToken }, // If it doesn't exist, create a new one
        });
        return result
     }
    async findByAccountId(shopId: string) {
        return await prisma.shopKeyToken.findFirst({
            where:{
                shopId
            }
        })
    }

    async removeKeyByUUID (shopId: string){
        const keyToken = await prisma.shopKeyToken.findFirst({
            where: { shopId }
        });
    
        if (keyToken) {
            return await prisma.shopKeyToken.delete({
                where: { id: keyToken.id }
            });
        } else {
            throw new NotFoundError("KeyToken not found");
        }
    }
    
    async findByRefreshTokenUsed(refreshToken: ShopKeyToken['refreshToken']){
        return await prisma.shopKeyToken.findFirst({
            where:{
                refreshTokensUsed:{
                    has:refreshToken
                }
            }
        })
    }

    async findByRefreshToken (refreshToken: ShopKeyToken['refreshToken']){
        return await prisma.shopKeyToken.findFirst({
            where:{refreshToken}
        })
    }
}

// UserToken.ts
export class UserToken implements IToken {
    async createKeyToken({ userId, publicKey , refreshToken }: UserKeyToken) {
        const result =  await prisma.userKeyToken.upsert ({
            where: { userId },
            update: { publicKey, refreshToken }, // If it exists, update the record
            create: { userId, publicKey, refreshToken }, // If it doesn't exist, create a new one
        });
        return result

    }

    async findByAccountId(userId: string): Promise<{} | null> {
        return await prisma.userKeyToken.findFirst({
            where:{
                userId
            }
        })
    }
}

// export abstract class AbstractAccountFactory {
//     abstract createAccount(type: 'shop' | 'user'): Account;
// }

// export abstract class AbstractTokenFactory {
//     abstract createToken(type: 'shop' | 'user'): Token;
// }

// class AccountFactory extends AbstractAccountFactory {
//     createAccount(type: 'shop' | 'user'): Account {
//         switch (type) {
//             case 'shop': return new ShopAccount();
//             case 'user': return new UserAccount();
//             default: throw new Error("Invalid account type");
//         }
//     }
// }

// class TokenFactory extends AbstractTokenFactory {
//     createToken(type: 'shop' | 'user'): Token {
//         switch (type) {
//             case 'shop': return new ShopToken();
//             case 'user': return new UserToken();
//             default: throw new Error("Invalid token type");
//         }
//     }
// }

// const accountFactory = new AccountFactory();
// export const shopAccount = accountFactory.createAccount('shop');
// export const userAccount = accountFactory.createAccount('user');

// const tokenFactory = new TokenFactory();
// export const shopToken = tokenFactory.createToken('shop');
// export const userToken = tokenFactory.createToken('user');

function clientCode(factory: AbstractFactory) {
    const account = factory.createAccount();
    const token = factory.createToken();
    return { account, token };
}


export const user = clientCode(new UserFactory());
export const shop = clientCode(new ShopFactory()) as { account: IShopAccount; token: IToken };
