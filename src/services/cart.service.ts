import { prisma } from "../database/init.postgresql";
import { 
    getCart,
    createUserCart,
    createCartProduct
} from "../repositories/cart.repository";
import { ICartProduct,ICartRequest } from "../controllers/cart.controller";
class CartService{
    static async addToCart({ userId, product }: {userId: string, product: ICartProduct}){
        //check cart existed or not, if not, create new cart
        const cart = await getCart({userId})

        if(!cart){
            return createUserCart({userId, product})
        }

        //check wheather cart has product or not, if not, add product to cart
        const countProductInCart = await prisma.cartProduct.count({
            where: {cartId:cart.id}
        })

        if(countProductInCart === 0){
            return createCartProduct({cartId:cart.id,product})
        }

        //check wheather product we're passing is cart existed in cart or not
        const checkCartProduct = await prisma.cartProduct.findFirst({
            where:{productId:product.productId}
        })

        if(!checkCartProduct){
            //increase count product by one
            await prisma.cart.update({
                where:{
                    id:cart.id
                },
                data:{
                    countProduct: cart.countProduct +=1
                }
            })
            // add this product to cart
            return createCartProduct({cartId:cart.id,product})
        }
    }

    static async update({ userId, shop_order_ids }: ICartRequest){
        //loop through each shop
        const cart = await getCart({ userId });

        if (!cart) {
            throw new Error("Cart not found for user");
        }

        for(const element of shop_order_ids){
            //loop through each product of shop
            for(const eachShop of element.item_products){
                const result = await prisma.cartProduct.update({
                    //composite key means we combine more column to establish the uniqueness
                    where: {
                        cartId_productId: {
                            cartId: cart.id,
                            productId: eachShop.productId,
                        },
                    },
                    data:{
                        quantity: {
                            increment: eachShop.quantity - eachShop.old_quantity
                        }
                    }
                })

                if(result.quantity === 0){
                    await prisma.cartProduct.delete({
                        where:{
                            id: result.id
                        }
                    })
                }
            }
        }
    }

    static async deleteUserCart({ userId, productId }: {userId:string, productId: string}){
        //delete certain product in carts
        const cart = await getCart({userId})

        if (!cart) {
            throw new Error("Cart not found for user");
        }
        await prisma.cart.update({
            where:{
                userId
            },
            data:{
                countProduct: cart.countProduct -= 1
            }
        })
        const deleteCart = await prisma.cartProduct.delete({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: productId,
                },
            },
          })
          
        return deleteCart          
    }

    static async getListUserCart({userId}:{userId: string}){
        const cart = await getCart({userId})

        return await prisma.cartProduct.findMany({
            where:{
                cartId:cart?.id
            }
        })
        
    }

}

export default CartService