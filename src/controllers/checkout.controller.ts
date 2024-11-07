import { Request, Response, NextFunction } from 'express'; 
import CheckoutService from '../services/checkout.service';
import { SuccessResponse } from '../core/success.response';

export interface ICheckoutRequest{
    cartId: string;
    userId: string,
    shop_order_ids:Ishop_order_ids[];
}

export interface Ishop_order_ids{
    shopId: string;
    shop_discounts:{
        shop_id: string,
        discountId: string,
        codeId: string
    }[];
    item_products:{
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