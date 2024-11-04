import express from 'express';
import  CartController from '../../controllers/cart.controller';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.post('',asyncHandler(CartController.addToCart))
router.delete('',asyncHandler(CartController.delete))
router.post('/update',asyncHandler(CartController.update))
router.get('',asyncHandler(CartController.listToCart))

export default router