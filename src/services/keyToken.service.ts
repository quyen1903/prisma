// import { NotFoundError } from '../core/error.response';
// import {prisma} from '../database/init.postgresql';

// export interface IKeyToken{
//     shopId: string;
//     publicKey: string;
//     refreshTokensUsed?: string[];
//     refreshToken: string;
// }

// class KeyTokenService{
//     static createKeyToken = async ({ shopId, publicKey , refreshToken }: IKeyToken) => {
//         return await prisma.shopKeyToken.upsert ({
//             where: { shopId },
//             update: { publicKey, refreshToken }, // If it exists, update the record
//             create: { shopId, publicKey, refreshToken }, // If it doesn't exist, create a new one
//         });
//     };

//     static findByUserId = async (shopId: string)=> {
//         return await prisma.shopKeyToken.findFirst({
//             where:{
//                 shopId
//             }
//         })
//     }

//     static removeKeyByUUID = async(shopId: string)=>{
//         const keyToken = await prisma.shopKeyToken.findFirst({
//             where: { shopId }
//         });
    
//         if (keyToken) {
//             return await prisma.shopKeyToken.delete({
//                 where: { id: keyToken.id }
//             });
//         } else {
//             throw new NotFoundError("KeyToken not found");
//         }
//     }
    
//     static findByRefreshTokenUsed = async(refreshToken: IKeyToken['refreshToken'])=>{
//         return await prisma.shopKeyToken.findFirst({
//             where:{
//                 refreshTokensUsed:{
//                     has:refreshToken
//                 }
//             }
//         })
//     }

//     static findByRefreshToken = async(refreshToken: IKeyToken['refreshToken'])=>{
//         return await prisma.shopKeyToken.findFirst({
//             where:{refreshToken}
//         })
//     }
// }

// export default KeyTokenService