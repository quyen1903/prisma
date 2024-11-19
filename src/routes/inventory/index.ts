import express from 'express';
import  InventoryController from '../../controllers/inventory.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();

router.use(authentication)

router.post('',asyncHandler(InventoryController.addStockToInventory));

export default router