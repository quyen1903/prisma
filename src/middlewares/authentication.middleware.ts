import { Request, Response, NextFunction } from 'express'; 
import JWT from 'jsonwebtoken'
import ApiKey from '../services/apikey.service';
import asyncHandler from '../shared/helper/async.handler'
import { AuthFailureError, NotFoundError } from '../core/error.response'
import KeyTokenService from '../services/keytoken.service';
import { JWTdecode } from '../shared/interface/jwt.interface';
import { findByUsedRefreshToken } from '../repositories/keytoken.repository';

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

export const authentication = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const accountId = req.headers[HEADER.CLIENT_ID] as string;
    if (!accountId) throw new AuthFailureError('Invalid Request, missing client ID');
  
    // Find account's KeyStore (shop or user)
    const keyStore = await KeyTokenService.findByAccountId(accountId); 
    if (!keyStore) throw new NotFoundError('KeyStore not found');

    //check refreshtoken
    if (req.headers[HEADER.REFRESHTOKEN]) {
      try {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;

        const checkUsedRefreshToken = await findByUsedRefreshToken(refreshToken)
        if(checkUsedRefreshToken) throw new AuthFailureError(' something was wrong, please login again')

        const decodedUser = JWT.verify(refreshToken, keyStore.publicKey) as JWTdecode;
  
        if (accountId !== decodedUser.accountId) throw new AuthFailureError('Invalid User ID');
        req.keyStore = keyStore;
        req.account = decodedUser;
        req.refreshToken = refreshToken;
        return next();
      } catch (error) {
        throw error;
      }
    }
  
    // Check Access Token
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
    if (!accessToken) throw new AuthFailureError('Invalid Request');
  
    try {
      const decodedUser = JWT.verify(accessToken, keyStore.publicKey) as JWTdecode;
      if (accountId !== decodedUser.accountId) throw new AuthFailureError('Invalid User ID');
      
      // Phân biệt loại tài khoản dựa trên role/accountType
      req.keyStore = keyStore;
      req.account = decodedUser;
      return next();
    } catch (error) {
      throw error;
    }
});
