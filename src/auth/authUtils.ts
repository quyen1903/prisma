import JWT from 'jsonwebtoken'
import { BadRequestError } from '../core/error.response'

export class JsonWebToken{
    private static accessToken(
        payload:{},
        privateKey: string
    ){
        return JWT.sign(payload,privateKey,{
            expiresIn:'2 days',
            algorithm:'RS256'
        })
    }

    private static refreshToken(
        payload:{},
        privateKey: string
    ){
        return JWT.sign(payload,privateKey,{
            expiresIn:'7 days',
            algorithm:'RS256'
        })
    }

    static createToken(
        payload: { accountId: string, email: string}, 
        publicKey: string,
        privateKey: string
    ){
        try {
            
            const accessToken =  this.accessToken(payload, privateKey)
            const refreshToken=  this.refreshToken(payload, privateKey)
        
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

    static createShopToken(
        payload: { 
            id: string,
            email: string,
            role: string,
            permission: string
        }, 
        publicKey: string,
        privateKey: string
    ){
        try {
            
            const accessToken =  this.accessToken(payload, privateKey)
            const refreshToken=  this.refreshToken(payload, privateKey)
        
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

    static createUserToken(
        payload: { 
            id: string,
            email: string,
            role: string,
            permission: string
        }, 
        publicKey: string,
        privateKey: string
    ){
        try {
            
            const accessToken =  this.accessToken(payload, privateKey)
            const refreshToken=  this.refreshToken(payload, privateKey)
        
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
}