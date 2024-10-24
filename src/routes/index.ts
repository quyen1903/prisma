import express from 'express';
import { apiKey, permission } from '../middlewares/authentication.middleware';

import access from './access';
import discount from './discount'
import product from './product'

const router = express.Router();

router.use('/',apiKey)
router.use(permission('0000'));


router.use('/v1/api/discount', discount)
router.use('/v1/api/product', product);
router.use('/v1/api', access);

export default router;