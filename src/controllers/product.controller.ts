import { Request, Response, NextFunction } from 'express'; 
import { SuccessResponse } from '../core/success.response';
import Factory from '../services/product.service';
import { CreateProductDTO, UpdateProductDTO } from '../dto/product.dto';
import { validator } from '../shared/utils'; 

class ProductController{

    createProduct = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new CreateProductDTO(req.body);
        await validator(payload)
        const result = await Factory.createProduct(payload.productType,{
            ...payload,
            productShop: req.shop.accountId
        })

        new SuccessResponse({
            message: 'Create new product success!',
            metadata: result
        }).send(res)
    }

    updateProduct = async(req: Request, res: Response, next: NextFunction)=>{
        const payload = new UpdateProductDTO(req.body);
        await validator(payload)
        const result = await Factory.updateProduct(payload.productType, req.params.productId, {
            ...payload,
            product_shop: req.shop.accountId
        })

        new SuccessResponse({
            message: 'Update new product success!',
            metadata: result
        }).send(res)
    }

    pubishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: ' Publish product success!',
            metadata: await Factory.publishProductByShop({
                productShopId: req.shop.accountId,
                uuid: req.params.id,
            })
        }).send(res)
    }

    unpublishProductByShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Undo publish product success!',
            metadata: await Factory.unPublishProductByShop({
                productShopId: req.shop.accountId,
                uuid: req.params.id,
            })
        }).send(res)
    }

    getAllDraftForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list Draft success',
            metadata: await Factory.findAllDraftsForShop({
                productShopId:req.shop.accountId
            })
        }).send(res)
    }

    getAllPublishForShop = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Get list publish success',
            metadata: await Factory.findAllPublishForShop({
                productShopId:req.shop.accountId
            })
        }).send(res)
    }

    getListSearchProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search Product success',
            metadata: await Factory.getListSearchProduct(req.params.keySearch)
        }).send(res)
    }

    findAllProducts = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search All Products success',
            metadata: await Factory.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message: 'Search Products success',
            metadata: await Factory.findProduct({
                productId:req.params.product_id
            })
        }).send(res)
    }
}

export default new ProductController()