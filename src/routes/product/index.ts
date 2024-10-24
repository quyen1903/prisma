import express from 'express';
import  productController from '../../controllers/product.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.get('/search/:keySearch',asyncHandler(productController.getListSearchProduct))
router.get('',asyncHandler(productController.findAllProducts))
router.get('/:product_id',asyncHandler(productController.findProduct))

router.use(authentication);

router.patch('/:productId',asyncHandler(productController.updateProduct));
router.post('/publish/:id',asyncHandler(productController.pubishProductByShop));
router.post('/unpublish/:id',asyncHandler(productController.unpublishProductByShop));
router.post('',asyncHandler(productController.createProduct));
router.get('/drafts/all',asyncHandler(productController.getAllDraftForShop));
router.get('/published/all',asyncHandler(productController.getAllPublishForShop));


export default router