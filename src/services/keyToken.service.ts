import { NotFoundError } from '../core/error.response';
import {prisma} from '../database/init.postgresql';

export interface IKeyToken{
    userId: string;
    publicKey: string;
    refreshTokensUsed?: string[];
    refreshToken: string;
}

class KeyTokenService{

    static createKeyToken = async ({ userId, publicKey , refreshToken }: IKeyToken) => {
        return await prisma.keyToken.upsert ({
            where: { userId },
            update: { publicKey, refreshToken }, // If it exists, update the record
            create: { userId, publicKey, refreshToken }, // If it doesn't exist, create a new one
        });
    };

    static findByUserId = async (userId: string)=> {
        return await prisma.keyToken.findFirst({
            where:{
                userId
            }
        })
    }

    static removeKeyByUUID = async(userId: string)=>{
        const keyToken = await prisma.keyToken.findFirst({
            where: { userId }
        });
    
        if (keyToken) {
            return await prisma.keyToken.delete({
                where: { id: keyToken.id }
            });
        } else {
            throw new NotFoundError("KeyToken not found");
        }
    }
    
    static findByRefreshTokenUsed = async(refreshToken: IKeyToken['refreshToken'])=>{
        return await prisma.keyToken.findFirst({
            where:{
                refreshTokensUsed:{
                    has:refreshToken
                }
            }
        })
    }

    static findByRefreshToken = async(refreshToken: IKeyToken['refreshToken'])=>{
        return await prisma.keyToken.findFirst({
            where:{refreshToken}
        })
    }
}

export default KeyTokenService