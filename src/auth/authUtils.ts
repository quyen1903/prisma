import JWT from 'jsonwebtoken'
import { BadRequestError } from '../core/error.response'

export const createTokenPair = async(payload: {
        userId: string,
        email: string
    }, publicKey: string, privateKey: string)=>{
    try {
        const accessToken =  JWT.sign(payload,privateKey,{
            expiresIn:'2 days',
            algorithm:'RS256'
        })
        const refreshToken=  JWT.sign(payload,privateKey,{
            expiresIn:'7 days',
            algorithm:'RS256'
        })
    
        //
        JWT.verify(accessToken,publicKey,(err,decode)=>{
            if(err){
                throw new BadRequestError(' JWT verify error :::')
            }else{
                console.log(`decode verify`,decode)
            }
        })
        return {accessToken,refreshToken}
    } catch (error) {
        console.log('Authentication Utilities error:::',error)
        throw new BadRequestError('Error creating token pair');
    }
}

export async function verifyJWT(token: string, keySecret: string){
    return JWT.verify(token, keySecret)
} 
