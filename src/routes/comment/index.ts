import express from 'express';
import  commentController from '../../controllers/comment.controller';
import { authentication } from '../../middlewares/authentication.middleware';
import asyncHandler from '../../shared/helper/async.handler';
const router = express.Router();



/* Authentication*/
router.use(authentication)

///////

router.post('',asyncHandler(commentController.createComment));
router.delete('',asyncHandler(commentController.deleteComment));
router.get('',asyncHandler(commentController.getCommentsByParentId));
//query

export default router