import express from 'express';
import userController from'../../controllers/user.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';

const router = express.Router();

router.post('/user/register',asyncHandler(userController.register))
router.post('/user/login',asyncHandler(userController.login))

router.use(authentication)

router.post('/user/logout',asyncHandler(userController.logout))
router.post('/user/handlerRefreshToken',asyncHandler(userController.handlerRefreshToken))

export default router