import crypto from 'node:crypto';
import {prisma} from '../database/init.postgresql';

export const findById = async (key: string)=>{
    // const newKey = await prisma.aPIkey.create({
    //     data:{
    //         key:crypto.randomBytes(64).toString('hex'),
    //         status:true,
    //         permission:['0000']
    //     }
    // })
    // console.log(newKey)
    const objectKey = await prisma.aPIkey.findFirst({where: {key}})
    return objectKey
}
