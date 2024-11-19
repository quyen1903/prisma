import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import CartService from '../services/cart.service';

export interface ICartRequest {
    userId: string;
    product?: ICartProduct[];  // Updated to an array
    shop_order_ids: {
        id:string,
        shopId: string;
        item_products: {
            quantity: number;
            price: number;
            shopId: string;
            old_quantity: number;
            productId: string;
        }[];
    }[];
    productId?: string;
};


export interface ICartProduct{
    productId: string,
    shopId: string,
    quantity: number,
    name: string,
    price: number
}

class CartController{

    addToCart = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Add new product to cart success',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    update = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'update Cart Success',
            metadata: await CartService.update(req.body)
        }).send(res)
    }

    delete = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'delete Cart Success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }
    
    listToCart = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Get list Cart Success',
            metadata: await CartService.getListUserCart(req.query.toString())
        }).send(res)
    }
}

export default new CartController()