import { prisma } from '../database/init.postgresql';
import  { getCart } from '../repositories/cart.repository'
import { BadRequestError } from '../core/error.response';
import { checkProductByServer } from '../repositories/product.repository';
import DiscountService from './discount.service';
import { ICheckoutRequest, Ishop_order_ids } from '../controllers/checkout.controller';
import { acquireLock, releaseLock } from './redis.service';


class CheckoutService{
    static async checkoutReview({ cartId, userId, shop_order_ids}: ICheckoutRequest){
        //check cart id existed?
        const cart = await getCart(cartId);
        if(!cart) throw new BadRequestError('Cart does not existed!!')

        const checkout_order = {
            totalPrice:0,
            feeShip:0,
            totalDiscount:0,
            totalCheckout:0//
        },shop_order_ids_new = []

        //total bill fee
        for(let i = 0; i < shop_order_ids.length; i++){
            const {shopId, shop_discounts, item_products} = shop_order_ids[i]
            /**
             * check product available
             * it return price, quantity and productId
            */
            const checkProductServer = await checkProductByServer(item_products)
            if(!checkProductServer[0]) throw new BadRequestError('order wrong !!!')

            //total fee order
            const checkoutPrice = checkProductServer.reduce((accumulate, product)=>{
                return accumulate +(product.quantity * product.price)
            },0)

            /**
             * total money before processing
            */
            checkout_order.totalPrice =+ checkoutPrice

            //push to new shop_orders_ids_new
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount:checkoutPrice,
                item_products:checkProductServer
            }

            //if shop_discounts > 0, check wheather valid
            if (shop_discounts.length > 0){
                //assum we only have 1 discount
                const { totalPrice = 0, discount = 0} = await DiscountService.getDiscountAmount({
                    discountCode:shop_discounts[0].codeId,
                    discountUserId:userId,
                    discountShopId:shopId,
                    discountProducts: checkProductServer
                })
                //total discount amout
                checkout_order.totalDiscount += discount

                //if discount greater than zero
                if(discount>0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            //total final fee
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return{
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }
    
    static async orderByUser({ 
        shop_order_ids, 
        cartId, userId, 
        user_address = {}, 
        user_payment = {} 
    }:{
        shop_order_ids: Ishop_order_ids[]
        cartId: string;
        userId: string;
        user_address: {};
        user_payment: {};
    }){
        const { shop_order_ids_new, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })
        //apply callback to each element of array and flattern result by one level
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        const accquireProduct = []
        
        for(let i = 0; i < products.length; i++){
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId);
            accquireProduct.push( keyLock ? true : false)
            if(keyLock){
                await releaseLock(keyLock)
            }
        }

        //check
        if(accquireProduct.includes(false)){
            throw new BadRequestError('some product has been updated')
        }

        const newOrder = await prisma.order.create({
            data:{
                orderUserId: userId,
                orderCheckout: checkout_order,
                order_shipping:user_address,
                order_payment:user_payment,
                order_products:shop_order_ids_new    
            }
        })

        //if insert success, remove product inside cart
        if(newOrder) 
        return newOrder
    }

    // static async getOrdersByUser(){

    // }

    // static async getOneOrdersByUser(){
        
    // }

    // static async cancelOrderByUser(){
        
    // }

    // static async updateOrdersByUser(){
        
    // }
}

export default CheckoutService