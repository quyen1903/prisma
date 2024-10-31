import express from 'express';
import apiController from'../../controllers/api.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';

const router = express.Router();

router.post('',asyncHandler(apiController.createApiKey))

export default router