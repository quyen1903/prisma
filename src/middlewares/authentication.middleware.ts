import { Request, Response, NextFunction } from 'express'; 
import JWT from 'jsonwebtoken'
import ApiKey from '../services/apikey.service';
import asyncHandler from '../shared/helper/async.handler'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import  KeyTokenService  from '../services/keyToken.service'

const HEADER ={
    API_KEY : 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id',
}

export interface IdecodeUser{
    userId: string,
    email: string,
    iat: number,
    exp: number
}

export const apiKey = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers[HEADER.API_KEY]?.toString() as string
    
    if (!key) {
        res.status(403).json({
            message: 'Forbidden error',
        });
    }
    // Check API key object
    const objKey = await ApiKey.findById(key);
    
    if (!objKey) {
        res.status(403).json({
            message: 'Forbidden error',
        });
    }

    req.apiKey = objKey!; // Assuming req is extended to include apiKey in its type
    next(); // Pass control to the next middleware or route handler
};


export const permission = ( permission: '0000' |'1111' |'2222' )=>{
    return(req: Request, res: Response, next: NextFunction)=>{
        if(!req.apiKey.permission){
            res.status(403).json({
                message:'permission dinied'
            })
        }
        console.log('permission :: ',req.apiKey.permission)
        const validPermission = req.apiKey.permission.includes(permission)
        console.log(validPermission)
        if(!validPermission){
            res.status(403).json({
                message:'permission dinied'
            })
        }
        return next()
    }
}


export const authentication = asyncHandler(async(req:Request, res: Response, next: NextFunction)=>{
    /* 
    1 - check userId misssing
    2 - check keytoken referencing to currently userId

    3   - if refresh token existed, check user in database
    3.1 - extends request header with keytoken, userId and refreshtoken
    3.2 - OK => return next()

    4   - get acccess token, check user in database
    4.1 - extends request header with keytoken, userId
    4.2 - OK => return next()

    */

    //1
    const userId = req.headers[HEADER.CLIENT_ID] as string
    if(!userId) throw new AuthFailureError('Invalid Request, missing client ID')    

    //2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if(!keyStore) throw new NotFoundError('Not Found Keystore')

    //3
    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
            const decodeUser = JWT.verify(refreshToken ,keyStore.publicKey) as IdecodeUser
            if(userId !== decodeUser.userId ) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    //4
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey) as IdecodeUser
        if( userId !== decodeUser.userId ) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})