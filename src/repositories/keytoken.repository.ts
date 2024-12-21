import { prisma } from "../database/init.postgresql";
import { KeyToken } from "../shared/interface/keyToken.interface";

export async function createKeyToken({accountId, publicKey, refreshToken, roles}: KeyToken){
    return await prisma.keyToken.upsert({
        where:  { accountId },
        update: { publicKey, refreshToken },
        create: { accountId, publicKey, refreshToken, roles },
    });
}

export async function findByAccountId(accountId: string) {
    return await prisma.keyToken.findFirst({
        where: { accountId },
    });
}

export async function dedleteKeyToken(id: string) {
    return await prisma.keyToken.delete({
        where:{
            id
        }
    })
}

export async function findByRefreshToken( refreshToken: string) {
    return await prisma.keyToken.findFirst({
        where: { refreshToken },
    });
}

export async function findByUsedRefreshToken(token:string) {
    return await prisma.refreshTokenUsed.findFirst({
        where: {
            token
        }
    })
}