import DiscountService from "../services/discount.service";
import { SuccessResponse } from'../core/success.response';
import { Request, Response, NextFunction } from 'express'; 
import { AmountDiscountDTO, CreateDiscountDTO, GetListDiscount } from "../dto/discount.dto";
import { validator } from '../shared/utils';

class DiscountController{
    //validate input data

    createDiscountCode = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new CreateDiscountDTO(req.body);
        console.log('discount',payload)
        await validator(payload);
        
        const result = await DiscountService.createDiscountCode({
            payload,
            shopId:req.shop.shopId
        })
        new SuccessResponse({
            message: 'Successfully generate code',
            metadata: result
        }).send(res)
    }

    getAllDiscountCodes = async(req: Request, res: Response, next: NextFunction)=>{
        console.log(req.query)
        new SuccessResponse({
            message:'Successfully get all code',
            metadata:await DiscountService.getAllDiscountCodesByShop({
                ...req.query as unknown as GetListDiscount
            })
        }).send(res)
    }

    getDiscountAmount = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new AmountDiscountDTO(req.body);
        await validator(payload);
        const result = await DiscountService.getDiscountAmount(payload)
        
        new SuccessResponse({
            message:'Successfully get Amount',
            metadata: result
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'Successfully get all code with product',
            metadata:await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query as unknown as GetListDiscount
            })
        }).send(res)
    }
    
    deleteDiscountCode = async(req: Request, res: Response, next: NextFunction)=>{
        const result = await DiscountService.deleteDiscountCode(req.body)

        new SuccessResponse({
            message: 'Success delete Discount Code',
            metadata: result
        }).send(res)
    }
}

export default new DiscountController()