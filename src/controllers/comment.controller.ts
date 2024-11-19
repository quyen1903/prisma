import { Request, Response, NextFunction } from 'express'; 
import { CommentService } from'../services/comment.service'
import{ SuccessResponse } from '../core/success.response';

export interface ICommentRequest{
    commentProductId: string;
    commentUserId: string;
    commentContent: string;
    commentParentId: string;
    commentId: string
}

class CommentController {
    createComment = async (req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'create new comment',
            metadata:await CommentService.createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'get comment id',
            metadata:await CommentService.getCommentsByParentId(req.query as unknown as ICommentRequest)
        }).send(res)
    }

    deleteComment = async(req: Request, res: Response, next: NextFunction)=>{
        new SuccessResponse({
            message:'deleted comment',
            metadata:await CommentService.deleteComments(req.body)
        }).send(res)
    }
}

export default new CommentController()