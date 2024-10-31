import { Request, Response, NextFunction } from 'express';
import { SuccessResponse } from '../core/success.response';
import ApiKeyService from '../services/apikey.service';

class ApiController{
    createApiKey = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'create API Key success',
            metadata: await ApiKeyService.createAPIKey()
        }).send(res)
    }
}

export default new ApiController()