import { prisma } from "../database/init.postgresql"
import { 
    getCart,
    createUserCart,
    createCartProduct } from "../repositories/cart.repository"
import { ICartProduct } from "../controllers/cart.controller"
class CartService{
    static async addToCart({ userId, product }: {userId: string, product: ICartProduct}){
        //check cart existed or not, if not, create new cart
        const userCart = await getCart({userId})

        if(!userCart){
            return createUserCart({userId, product})
        }

        //check wheather cart has product or not, if not, add product to cart
        const countProductInCart = await prisma.cartProduct.count({
            where: {userCartId:userCart.id}
        })

        if(countProductInCart === 0){
            return createCartProduct({userCartId:userCart.id,product})
        }

        //check wheather product we're passing is
        const checkCartProduct = await prisma.cartProduct.findFirst({
            where:{productId:product.productId}
        })

        if(!checkCartProduct){
            await prisma.cart.update({
                where:{
                    id:userCart.id
                },
                data:{
                    countProduct: userCart.countProduct +=1
                }
            })
            return createCartProduct({userCartId:userCart.id,product})
        }
    }

    static async deleteUserCart({ userId, productId }: {userId:string, productId: string}){
        //delete certain product in carts
        
        const deleteCart = await prisma.cartProduct.delete({
            where: {
                productId
            },
          })
          
        return deleteCart          
    }

    static async getListUserCart({userId}:{userId: number}){
        const cart = await getCart({userId})

        return await prisma.cartProduct.findMany({
            where:{
                userCartId:cart?.id
            }
        })
        
    }

}

export default CartService