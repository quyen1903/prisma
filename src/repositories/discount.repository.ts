import { prisma } from "../database/init.postgresql";
import { getSelectData } from "../shared/utils";

export const findAllDiscountCodesSelect = async(take: number, skip: number,filter: object,select: string[] )=>{
    return await prisma.discount.findMany({
        //sort by create decending
        where: filter,
        orderBy:{
            createdAt: 'asc'
        },
        select:getSelectData(select),
        take,
        skip,
    })
}

export const checkDiscountExists = async(filter: {})=>{
    return await prisma.discount.findFirst({where:filter})
}

export const deleteDiscountCode = async(discountShopId: string, discountCode: string)=>{
    return await prisma.discount.delete({
        where: {
            discountCode,
            discountShopId
        }
    })
}