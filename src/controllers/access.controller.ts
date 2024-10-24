import { Request, Response, NextFunction } from 'express'; 
import AccessService from "../services/access.service"
import { SuccessResponse } from '../core/success.response'

export interface IAccessRequest{
    name: string;
    email: string;
    password: string
}

class AccessController{
    handlerRefreshToken = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get token success',
            metadata:await AccessService.handleRefreshToken(
                req.keyStore,
                req.user,
                req.refreshToken,
            )
        }).send(res)
    }
    logout = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'logout success',
            metadata:await AccessService.logout( req.keyStore )
        }).send(res)
    }
    login = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'login success',
            metadata:await AccessService.login(req.body)
        }).send(res)
    }
    register = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'register success',
            metadata: await AccessService.register(req.body)
        }).send(res);
    }

}
export default new AccessController()