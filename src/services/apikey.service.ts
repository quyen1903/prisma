import crypto from 'node:crypto';
import {prisma} from '../database/init.postgresql';

class ApiKeyService{
    static findById = async (key: string)=>{
        const objectKey = await prisma.aPIkey.findFirst({where: {key}})
        return objectKey
    }
    
    static createAPIKey = async()=>{
        const newKey = await prisma.aPIkey.create({
            data:{
                key:crypto.randomBytes(64).toString('hex'),
                status:true,
                permission:['0000']
            }
        })
        return newKey
    }
}

export default ApiKeyService