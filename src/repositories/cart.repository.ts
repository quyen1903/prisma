import { prisma } from "../database/init.postgresql";
import { ICartProduct } from "../controllers/cart.controller";

export const getCart = async(filter:{})=>{
    return await prisma.cart.findFirst({
        where:filter
    })
}

export const createUserCart = async ({ userId, product }: {userId: string, product: ICartProduct}) => {
    return await prisma.cart.create({
        data: {
            userId,
            cartProducts: {
                create: product
            },
            countProduct:1
        },
    });
};

export const createCartProduct = async({ userCartId, product }: {userCartId: string, product: ICartProduct})=>{
    return await prisma.cartProduct.create({
        data:{
            productId: product.productId,
            shopId: product.productId,
            quantity: product.quantity,
            name: product.name,
            price: product.price,
            userCartId
        }
    })
}