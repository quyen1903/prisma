import { PrismaClient } from "@prisma/client";
import { prisma } from "../database/init.postgresql";
import { getSelectData, unGetSelectData } from "../shared/utils";
import { ICheckoutRequest, IshopOrderIds } from "../controllers/checkout.controller";


export const findAll = async(where: any, skip:number, take:number)=>{
    return await prisma.product.findMany({
        where,
        orderBy: {
            id: 'desc',
        },
        skip,
        take,
    })
}

export const publish = async(productShopId: string, id: string, isDraft: boolean, isPublished:boolean)=>{
    return await prisma.product.update({
        where:{
            id,
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

export const findProduct = async(id: string, unSelect: string[])=>{
    return await prisma.product.findUnique({
        where:{id},
        select:unGetSelectData(unSelect)
    })
}

export const getProductById = async (productId: string)=>{
    return await prisma.product.findUnique({
        where: {
            id:productId
        }
    })
}

/* 
    this is parameter
    products: {
        productId: string;
        quantity: number;
        price: number;
    }[]
    we loop through this array of object
    with each iterate we will get product by productId,
    to get product we have to fetch product information which stored in postgres
    that's why each iterate is a promise
    and we have to loop through array of promise
    that's why we use Promise.all()
*/
export async function checkProductByServer(products:IshopOrderIds['itemProducts']){
    const result = await Promise.all(products.map(
        async (product)=>{
            const foundProduct = await getProductById(product.productId)
            if(foundProduct){
                return{
                    price:foundProduct.productPrice,
                    quantity:product.quantity,
                    productId:product.productId
                }
            }
        }
    ))
    return result as IshopOrderIds['itemProducts'];
}
