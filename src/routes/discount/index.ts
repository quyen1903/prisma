import express from 'express';
import  DiscountController from '../../controllers/discount.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount));
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProducts));

router.use(authentication)

router.post('',asyncHandler(DiscountController.createDiscountCode));
router.get('',asyncHandler(DiscountController.getAllDiscountCodes));
router.delete('',asyncHandler(DiscountController.deleteDiscountCode))

export default router