import express from 'express';
import { apiKey, permission } from '../middlewares/authentication.middleware';

import shop from './shop';
import api from './api';
import discount from './discount';
import inventory from './inventory';
import product from './product';
import cart from './cart';
import user from './user'

const router = express.Router();
router.use('/v1/api/api',api)

router.use('/',apiKey)
router.use(permission('0000'));

router.use('/v1/api/cart', cart)
router.use('/v1/api/discount', discount)
router.use('/v1/api/inventory', inventory)
router.use('/v1/api/product', product);
router.use('/v1/api/user', user)
router.use('/v1/api', shop);

export default router;