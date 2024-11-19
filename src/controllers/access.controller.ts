import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import { shop } from '../services/account.service';

class AccessController{
    handlerRefreshToken = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get token success',
            metadata:await shop.account.handleRefreshToken(
                req.keyStore,
                req.shop,
                req.refreshToken,
            )
        }).send(res)
    }
    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await shop.account.logout( req.keyStore )
        }).send(res)
    }
    login = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'login success',
            metadata: await shop.account.login(req.body)
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'register success',
            metadata: await shop.account.register(req.body)
        }).send(res);
    }

}
export default new AccessController()