import { prisma,pg } from '../database/init.postgresql';
import { NotFoundError } from '../core/error.response';
import { findProduct } from '../repositories/product.repository';
import { ICommentRequest } from '../controllers/comment.controller';

/**
 * implement nested set model to increase query speed
 *  each comment have left/right
 * the flow run from top to bottom, from left to right
 * we find child comment by range of left/right number 
 * of parent comment.
 */

/**
 * key feature: comment services
 * add comment [user,shop]
 * get list of comment[user,shop]
 * delete comment[user,shop,admin]
 */
export class CommentService{
    static async createComment({commentProductId, commentUserId, commentContent, commentParentId = ""}: ICommentRequest){
        const comment = prisma.comment.create({
            data:{
                commentProductId,
                commentUserId,
                commentContent,
                commentParentId
            }
        })

        let rightValue: number;
        if(commentParentId){
            //reply comment
            const parentComment = await prisma.comment.findUnique({
                where:{commentParentId}
            })
            if(!parentComment) throw new NotFoundError('not found parent comment')
            rightValue = parentComment.commentRight

            /**
             * updatemany comment about this product
             * all comment which have right value greater or equal parent comment increase by 2
             * 
             */
            await prisma.comment.updateMany({
                where:{
                    commentProductId: commentProductId,
                    commentRight: { gte: rightValue }

                },data:{
                    commentRight:{ increment:2 }
                }
            })

            await prisma.comment.updateMany({
                where:{
                    commentProductId: commentProductId,
                    commentLeft: { gte: rightValue }

                },data:{
                    commentLeft:{ increment:2 }
                }
            })
        }else{
            /**
             * parent comment not existed 
             */

            const maxRightValue = await prisma.comment.findFirst({
                where:{ commentProductId },
                select:{ commentRight: true},
                orderBy:{ commentRight: 'desc'}
            })

            if(maxRightValue){
                rightValue = maxRightValue.commentRight + 1
            }else{
                rightValue = 1
            }

        }

        //insert comment
        (await comment).commentLeft = rightValue;
        (await comment).commentRight = rightValue+1

        return comment
    }

    static async getCommentsByParentId({ commentProductId, commentParentId = '' }:ICommentRequest){
        if(commentParentId){
            const parent = await prisma.comment.findUnique({
                where:{commentParentId}
            })
            if(!parent) throw new NotFoundError('Not found comment for product')
            const comments = await prisma.comment.findFirst({
                where:{
                    commentProductId,
                    commentLeft:{ gt: parent.commentLeft},
                    commentRight:{ lte: parent.commentRight}
                },select:{
                    commentLeft: true,
                    commentRight: true,
                    commentContent: true,
                    commentParentId: true
                },orderBy:{
                    commentLeft:'asc'
                }
            })
            return comments
        }

        const comments = await prisma.comment.findFirst({
            where:{
                commentProductId,
                commentParentId
            },select:{
                commentLeft: true,
                commentRight: true,
                commentContent: true,
                commentParentId: true
            },orderBy:{
                commentLeft:'asc'
            }
        })

        return comments
    }

    static async deleteComments({commentId, commentProductId}: ICommentRequest){
        const foundProduct = await findProduct(commentProductId,['__v'])
        if(!foundProduct) throw new NotFoundError('product not found')

        //1 determine left/right value
        const comment =  await prisma.comment.findUnique({
            where:{id: commentId}
        })
        if(!comment) throw new NotFoundError('comment not found')

        // const comment = await Comment.findById(commentId)
        // if(!comment) throw new NotFoundError('comment not found')
        const leftValue = comment.commentLeft
        const rightValue = comment.commentRight

        //2 caculate width 
        const width = rightValue - leftValue +1

        //3delete all subcomment
        await prisma.comment.deleteMany({
            where:{
                commentProductId,
                commentLeft: { gte: leftValue, lte: rightValue}
            }
        })

        //4 update remain left/right value
        await prisma.comment.updateMany({
            where:{
                commentProductId,
                commentRight:{ gt: rightValue }
            },
            data:{
                commentRight: { increment: -width}
            }
        })

        await prisma.comment.updateMany({
            where:{
                commentProductId,
                commentLeft: { gt: rightValue}
            },
            data:{
                commentLeft: { increment: -width}
            }
        })
        return true
    }
}

