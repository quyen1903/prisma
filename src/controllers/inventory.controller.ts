import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import InventoryService from '../services/inventory.service';

export interface IInventoryRequest{
    productId: string;
    location: string;
    stock: number;
}

class InventoryController{
    addStockToInventory = async function(req: Request, res: Response, next: NextFunction){
        new SuccessResponse({
            message:'Add Stock To inventory Success',
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}


export default new InventoryController()