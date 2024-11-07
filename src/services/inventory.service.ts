import { prisma } from '../database/init.postgresql';
import { BadRequestError } from '../core/error.response';
import { getProductById } from '../repositories/product.repository';
import { IInventoryRequest } from '../controllers/inventory.controller';
class InventoryService{
    static async addStockToInventory({ stock, productId, location = '17A, Conghoa' }:IInventoryRequest){
        const product = await getProductById(productId)
        if(!product) throw new BadRequestError('the product is not existed!!!')
        
        //To make upsert() behave like a findOrCreate() method, provide an empty update parameter to upsert().
        return prisma.inventory.upsert({
            where:{
                inventoryProductId: productId
            },
            update:{},
            create:{
                inventoryStock: stock,
                inventoryLocation: location,
                inventoryReservations:[],
                inventoryProductId: productId
            }
        })
    }
}

export default InventoryService