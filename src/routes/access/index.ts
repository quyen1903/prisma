import express from 'express';
import accessController from'../../controllers/access.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';

const router = express.Router();

router.post('/shop/register',asyncHandler(accessController.register))
router.post('/shop/login',asyncHandler(accessController.login))

router.use(authentication)

router.post('/shop/logout',asyncHandler(accessController.logout))
router.post('/shop/handlerRefreshToken',asyncHandler(accessController.handlerRefreshToken))

export default router