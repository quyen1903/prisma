import { prisma } from "../database/init.postgresql";
import { 
    getCart,
    createUserCart,
    createCartProduct 
} from "../repositories/cart.repository";
import { ICartProduct,ICartRequest } from "../controllers/cart.controller";
import {getProductById} from "../repositories/product.repository";
import { NotFoundError } from "../core/error.response";
class CartService{
    static async addToCart({ userId, product }: {userId: string, product: ICartProduct}){
        //check cart existed or not, if not, create new cart
        const userCart = await getCart({userId})

        if(!userCart){
            return createUserCart({userId, product})
        }

        //check wheather cart has product or not, if not, add product to cart
        const countProductInCart = await prisma.cartProduct.count({
            where: {cartId:userCart.id}
        })

        if(countProductInCart === 0){
            return createCartProduct({cartId:userCart.id,product})
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
            return createCartProduct({cartId:userCart.id,product})
        }
    }

    static async updateUserCartQuantity({ userId, product }: {userId: string, product: ICartProduct}){
        const {productId, quantity} = product
        // const query = { 
        //     cart_userId: userId,
        //     "cart_products.productId": productId,
        //     cart_state: 'active'
        // },updateSet = {
        //     $inc:{
        //         'cart_products.$.quantity': quantity
        //     }
        // },options = {upsert:true, new:true};

        const cart = await getCart({userId})

        return await prisma.cartProduct.update({
                where:{
                    cartId: cart?.id,
                    productId
                },
                data:{
                    quantity
                }

        })
    }

    static async update({ userId, shop_order_ids }: ICartRequest){
        const { productId, shopId, price, quantity, old_quantity } = shop_order_ids[0]?.item_products[0];
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError('product not found')

        if(foundProduct.productShopId.toString() !== shop_order_ids[0]?.shopId){
            throw new NotFoundError('Product not belong to the shop')
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product:{
                productId,
                shopId,
                price,
                name: '',
                quantity:quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }: {userId:string, productId: string}){
        //delete certain product in carts
        const userCart = await getCart({userId})

        await prisma.cart.update({
            where:{
                userId
            },
            data:{
                countProduct: userCart!.countProduct -= 1
            }
        })
        const deleteCart = await prisma.cartProduct.delete({
            where: {
                productId
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