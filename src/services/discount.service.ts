import { prisma,pg } from "../database/init.postgresql";
import { AmountDiscountDTO, CreateDiscountDTO, GetListDiscount    } from "../dto/discount.dto";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { findAllProducts } from "../repositories/product.repository";
import { 
    findAllDiscountCodesSelect,
    checkDiscountExists,
    deleteDiscountCode
} from "../repositories/discount.repository";
class DiscountService {
    static async createDiscountCode({
        payload: {
            discountName,
            discountDescription,
            discountType,
            discountValue,
            discountCode,
            discountStartDate,
            discountEndDate,
            discountMaxUses,
            discountUsesCount,
            discountUsersUsed,
            discountMaxUsesPerUser,
            discountMinOrderValue,
            discountIsActive,
            discountAppliesTo,
            discountProductIds,
        },
        shopId,
        }: {
            payload: CreateDiscountDTO;
            shopId: string;
    }){
        // Validate the date range for the discount code
        if (new Date() < new Date(discountStartDate) || new Date() > new Date(discountEndDate)) {
            throw new BadRequestError('Discount code has expired');
        }

        if (new Date(discountStartDate) >= new Date(discountEndDate)) {
            throw new BadRequestError('Start date must be before end date');
        }

        //check weather this discount used or not
        const foundDiscount = await prisma.discount.findFirst({
            where:{
                discountCode: discountCode,
                discountShopId: shopId
            }
        })

        if(foundDiscount && foundDiscount.discountIsActive){
            throw new BadRequestError('Discount existed!!!');
        }

        const newDiscount = await prisma.discount.create({
            data:{
                discountName,
                discountDescription,
                discountType,
                discountValue,
                discountCode,
                discountStartDates: new Date(discountStartDate),
                discountEndDates: new Date(discountEndDate),
                discountMaxUses,
                discountUsesCount,
                discountUsersUsed,
                discountMaxUsesPerUser,
                discountMinOrderValue,
                discountShopId: shopId,
                discountIsActive,
                discountAppliesTo,
                discountProductIds
            }
        })

        return newDiscount
    }
    static async getAllDiscountCodesWithProduct({ discountCode, discountShopId}:GetListDiscount){
        //check weather discount used or existed
        const foundDiscount = await checkDiscountExists({
            discountCode,
            discountShopId,
        })

        if(!foundDiscount || !foundDiscount.discountIsActive){
            throw new NotFoundError('discount not existed!!')
        }

        const { discountAppliesTo, discountProductIds } = foundDiscount
        let products;

        //if discount apply for all product, we fillter by all product of specific shop
        if(discountAppliesTo === 'all'){
            products = await findAllProducts(
                50,
                0,
                {
                    productShop: discountShopId,
                    isPublished:true
                },
                ['productName']
            )
        };

        /*
            if discount apply for specific product we filter by all product
            which is in discount_product_ids[]
            $in operator selects the documents where the value of a field equals any value in the specified array
        */

            if(discountAppliesTo === 'specific'){
                products = await findAllProducts(
                   50,
                   0,
                    {
                        uuid: discountProductIds,
                        isPublished:true
                    },
                    ['productName']
                )
            }
            return products
    }

    static async getAllDiscountCodesByShop({ discountLimit, discountPage, discountShopId }:GetListDiscount){
        const discounts = await findAllDiscountCodesSelect(
            Number(discountLimit),
            Number(discountPage),
            {
                discountShopId,
                discountIsActive:true,
            },
            ['discountCode', 'discountName']
        )
        return discounts
    }

    static async getDiscountAmount({ discountCode, discountUserId, discountShopId, discountProducts }: AmountDiscountDTO){
        const foundDiscount = await checkDiscountExists({
            discountCode,
            discountShopId,
        })

        if(!foundDiscount) throw new NotFoundError('discount doesnt exist')
        const {
            discountStartDates,
            discountEndDates,
            discountIsActive,
            discountMaxUses,
            discountMinOrderValue,
            discountMaxUsesPerUser,
            discountUsersUsed,
            discountType,
            discountValue,
        } = foundDiscount;
        if(!discountIsActive) throw new NotFoundError('discount is expired!')
        if(!discountMaxUses) throw new NotFoundError('discount are out!')

        if(new Date() < new Date(discountStartDates) || new Date() > new Date(discountEndDates)){
            throw new NotFoundError('discount code had expired!!')
        }

        //check wheather discount had minimum value
        let totalOrder = 0
        if(discountMinOrderValue > 0){
            totalOrder = discountProducts!.reduce((accumulator, product)=>{
                return accumulator + (product.discountQuantity * product.discountPrice)
            },0)
            if(totalOrder < discountMinOrderValue) {
                throw new NotFoundError(`discount require a minimum order of ${discountMinOrderValue}`)
            }
        }

        //check wheather discount had maximum value
        if(discountMaxUsesPerUser > 0){
            const userUserDiscount = discountUsersUsed.find(element => element.toString() === discountUserId)
            if(userUserDiscount){
                throw new BadRequestError('this user already use this discount')
            }
        }

        //check wheather discount is fixed amount
        const amount = discountType === 'fixed_amount' ? discountValue : totalOrder * (discountValue / 100)

        return {
            totalOrder,
            discount:amount,
            totalPrice:totalOrder - amount
        }
    }

    static async deleteDiscountCode({discountShopId, discountCode}:AmountDiscountDTO){
        const deleted = deleteDiscountCode(discountShopId, discountCode)
        return deleted
    }

    static async cancelDiscountCode({ discountCode, discountShopId, discountUserId }:AmountDiscountDTO){
        const foundDiscount = await checkDiscountExists({
            filter:{
                discountCode,
                discountShopId
            }
        })
        if(!foundDiscount) throw new NotFoundError('discount doesnt exist')
        const updateQuery = `
        UPDATE "discount"
        SET "discount_users_used" = array_remove(discount_users_used, $1)
            "discount_max_uses" = "discount_max_uses" +1,
            "discount_uses_count" = "discount_uses_count" -1
        WHERE "uuid" = $2
        `;
        await pg.query(updateQuery, [discountUserId, foundDiscount.id]);
        
        return updateQuery
    }

}
export default DiscountService