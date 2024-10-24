import { PrismaClient } from "@prisma/client";
import { prisma } from "../database/init.postgresql";
import { getSelectData, unGetSelectData } from "../shared/utils";

export const findAll = async(where: any, skip:number, take:number)=>{
    return await prisma.product.findMany({
        where,
        orderBy: {
            id: 'desc',
        },
        skip,//
        take,//
        // select:{
        //     productName: true,
        //     productThumb: true,
        //     productDescription: true,
        //     productPrice: true,
        //     productQuantity: true,
        //     productType: true,
        //     productShop:{
        //         select:{
        //             name: true,
        //             email: true,
        //         }
        //     }
        // }
    })
}

export const publish = async(productShopId: string, uuid: string, isDraft: boolean, isPublished:boolean)=>{
    return await prisma.product.update({
        where:{
            uuid,
            productShopId
        },
        data:{
            isDraft,
            isPublished
        }
    })
}

//full text search
export const searchProductByUser = async(keySearch: string)=>{
    return await prisma.product.findMany({
        where:{
            productName: {
                search: keySearch
            },
            productDescription:{
                search:keySearch
            }
        }
    })
}

export const findAllProducts = async(take: number, skip: number, filter: object, select: string[])=>{
    return await prisma.product.findMany({
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

export const findProduct = async(uuid: string, unSelect: string[])=>{
    return await prisma.product.findUnique({
        where:{uuid},
        select:unGetSelectData(unSelect)
    })
}