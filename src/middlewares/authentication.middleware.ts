import { Request, Response, NextFunction } from 'express'; 
import JWT from 'jsonwebtoken'
import ApiKey from '../services/apikey.service';
import asyncHandler from '../shared/helper/async.handler'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import { shop, user } from '../services/account.service';
import { JWTdecode } from '../shared/interface/jwt.interface';

const HEADER ={
    API_KEY : 'x-api-key',
    CLIENT_ID:'x-client-id',
    AUTHORIZATION:'authorization',
    REFRESHTOKEN:'x-rtoken-id',
}

export async function apiKey (req: Request, res: Response, next: NextFunction){
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

export function permission( permission: '0000' |'1111' |'2222' ){
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

    const accountId = req.headers[HEADER.CLIENT_ID] as string
    if(!accountId) throw new AuthFailureError('Invalid Request, missing client ID')    

    const keyStore = await shop.token.findByAccountId(accountId)
    if(!keyStore) throw new NotFoundError('Not Found Keystore')

    if(req.headers[HEADER.REFRESHTOKEN]){
        try {
            const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
            const decodeUser = JWT.verify(refreshToken ,keyStore.publicKey) as JWTdecode
            if(accountId !== decodeUser.accountId ) throw new AuthFailureError('Invalid User Id')
            req.keyStore = keyStore
            req.shop = decodeUser
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    if(!accessToken) throw new AuthFailureError('Invalid Request')

    try {
        const decodeUser = JWT.verify(accessToken,keyStore.publicKey) as JWTdecode
        if( accountId !== decodeUser.accountId ) throw new AuthFailureError('Invalid User Id');
        req.keyStore = keyStore
        req.shop = decodeUser
        return next()
    } catch (error) {
        throw error
    }
})






