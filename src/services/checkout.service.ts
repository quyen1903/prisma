import { prisma } from '../database/init.postgresql';
import  { getCart } from '../repositories/cart.repository'
import { BadRequestError } from '../core/error.response';
import { checkProductByServer } from '../repositories/product.repository';
import DiscountService from './discount.service';
import { ICheckoutRequest, IshopOrderIds } from '../controllers/checkout.controller';
import { acquireLock, releaseLock } from './redis.service';


class CheckoutService{
    static async checkoutReview({ cartId, userId, shopOrderIds}: ICheckoutRequest){
        //check cart id existed?
        const cart = await getCart(cartId);
        if(!cart) throw new BadRequestError('Cart does not existed!!')

        /**
         * user can buy many product from many shop
         * checkout will return array of product and price
         *  
         */
        const checkout_order = {
            totalPrice:0,
            feeShip:0,
            totalDiscount:0,
            totalCheckout:0
        },shopOrderIdsNew = []

        //total bill fee
        for(let i = 0; i < shopOrderIds.length; i++){
            const {shopId, shopDiscounts, itemProducts} = shopOrderIds[i]
            /**
             * check product available
             * it return price, quantity and productId
            */
            const checkProductServer = await checkProductByServer(itemProducts)
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
                shopDiscounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount:checkoutPrice,
                itemProducts:checkProductServer
            }

            //if shop_discounts > 0, check wheather valid
            let discount = 0;
            if (shopDiscounts.length > 0){
                for(let i = 0; i<=shopDiscounts.length; i++){
                    const result = await DiscountService.getDiscountAmount({
                        discountCode:shopDiscounts[0].codeId,
                        discountUserId:userId,
                        discountShopId:shopId,
                        discountProducts: checkProductServer
                    })
                    discount += result.discount
                }

                //total discount amout
                checkout_order.totalDiscount += discount

                //if discount greater than zero
                if(discount>0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            //total final fee
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shopOrderIdsNew.push(itemCheckout)
        }
        return{
            shopOrderIds,
            shopOrderIdsNew,
            checkout_order
        }
    }
    
    static async orderByUser({ 
        shopOrderIds, 
        cartId, userId, 
        user_payment = {} 
    }:{
        shopOrderIds: IshopOrderIds[]
        cartId: string;
        userId: string;
        user_address: {};
        user_payment: {};
    }){
        const { shopOrderIdsNew, checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shopOrderIds
        })
        //apply callback to each element of array and flattern result by one level
        const products = shopOrderIdsNew.flatMap(order => order.itemProducts);
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
                orderPayment:user_payment,
                orderProduct:shopOrderIdsNew    
            }
        })

        //if insert success, remove product inside cart
        if(newOrder) 
        return newOrder
    }

    static async getOrdersByUser(userId : string){
        const order = await prisma.order.findMany({
            where:{
                orderUserId: userId
            }
        })

        if(!order) throw new BadRequestError('wrong userId in get order, please try again');
        return order
    }

    static async getOneOrdersByUser(userId : string, orderId: string){
        const order = await prisma.order.findUnique({
            where:{
                id: orderId,
                orderUserId: userId
            }
        })

        if(!order) throw new BadRequestError('wrong userId or orderId in get order, please try again');
        return order
    }

    // static async cancelOrderByUser(){
        
    // }

    // static async updateOrdersByUser(){
        
    // }
}

export default CheckoutService