import { Request, Response, NextFunction } from 'express'; 
import CheckoutService from '../services/checkout.service';
import { SuccessResponse } from '../core/success.response';

export interface ICheckoutRequest{
    cartId: string;
    userId: string,
    shopOrderIds: IshopOrderIds[];
}

export interface IshopOrderIds{
    shopId: string;
    shopDiscounts:{
        shop_id: string,
        discountId: string,
        codeId: string
    }[];
    itemProducts:{
        productId: string,
        quantity: number,
        price: number,
    }[]
}


class CheckoutController{
    checkoutReview = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'checkout review Success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }

}


export default new CheckoutController()