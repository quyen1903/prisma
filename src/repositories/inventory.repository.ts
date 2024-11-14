import { prisma } from '../database/init.postgresql';

export const insertInventory = async ({ 
    productId,
    stock,
    location
}:{
    productId:string,
    stock: number,
    location: string,
})=>{
    return await prisma.inventory.create({
        data:{
            inventoryProductId: productId,
            inventoryStock: stock,
            inventoryLocation: location,
        }
    })
}

//this function subtract number of quantity which user order
export const reservationInventory = async ({ productId, quantity, cartId }: {
    productId: string,
    quantity: number,
    cartId: string
}) => {
    try {
        const result = await prisma.inventory.update({
            where: {
                inventoryProductId: productId,
            },
            data: {
                inventoryStock: { increment: -quantity },
                inventoryReservations: {
                    push: {
                        quantity,
                        cartId,
                        create_on: new Date(),
                    }
                }
            }
        });

        // If result is returned, the update was successful
        return result;
    } catch (error) {
        console.error('Failed to reserve inventory:', error);
        return null;
    }
}