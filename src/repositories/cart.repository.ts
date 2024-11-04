import { prisma } from "../database/init.postgresql";
import { ICartProduct } from "../controllers/cart.controller";

export const getCart = async(filter:{})=>{
    return await prisma.cart.findFirst({
        where:filter
    })
}

export const createUserCart = async ({ userId, product }: {userId: string, product: ICartProduct}) => {
    const cart = await prisma.cart.create({
        data: {
            userId,
            countProduct:1
        },
    });

    createCartProduct({cartId:cart.id,product})
};

export const createCartProduct = async({ cartId, product }: {cartId: string, product: ICartProduct})=>{
    const cartExists = await prisma.cart.findUnique({
        where: { id: cartId },
    });
    
    if (!cartExists) {
        throw new Error(`Cart with ID ${cartId} does not exist.`);
    }
    return await prisma.cartProduct.create({
        data:{
            productId: product.productId,
            shopId: product.shopId,
            quantity: product.quantity,
            name: product.name,
            price: product.price,
            cartId: cartId
        }
    })
}

export async function productExistedInCart(productId: string){
    return await prisma.cartProduct.findFirst({
        where:{productId}
    })
}