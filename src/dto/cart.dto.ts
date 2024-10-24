import { IsInt, IsNotEmpty, IsString, IsNumber, ValidateNested, IsArray } from "class-validator"
import { Type } from "class-transformer"

class Product{
    @IsString()
    @IsNotEmpty()
    productId:string

    @IsString()
    @IsNotEmpty()
    shopId:string

    @IsInt()
    @IsNotEmpty()
    quantity:number

    @IsString()
    @IsNotEmpty()
    name:string

    @IsNumber()
    @IsNotEmpty()
    price:number
}

class ShopOrderIds{
    @IsString()
    @IsNotEmpty()
    shopId: string

    @IsArray()
    @ValidateNested()
    @Type(()=> Product)
    item_products: Item_Products[]

    @IsInt()
    version:number
}
class Item_Products{
    @IsNumber()
    @IsNotEmpty()
    quantity: number

    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    shopId:string

    @IsNumber()
    old_quantity:number

    @IsString()
    @IsNotEmpty()
    productId:string

    @IsString()
    @IsNotEmpty()
    name: string
}
export class AddCart{
    @IsInt()
    @IsNotEmpty()
    userId:number

    @IsNotEmpty()
    @ValidateNested()  // Validate nested class
    @Type(() => Product)  // Correctly transform nested object
    product: Product;

    constructor({userId, product}:{userId: number, product:Product}){
        this.userId = userId,
        this.product = product
    }
}

export class UpdateCart{
    @IsInt()
    @IsNotEmpty()
    userId:number

    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    @Type(()=> ShopOrderIds)
    shop_order_ids:ShopOrderIds[]

    constructor({userId, shop_order_ids}: {userId: number, shop_order_ids: ShopOrderIds[]}){
        this.userId = userId,
        this.shop_order_ids = shop_order_ids
    }
}

export class DeleteCart{
    @IsInt()
    @IsNotEmpty()
    userId:number

    @IsString()
    @IsNotEmpty()
    productId:string

    constructor({userId, productId}: {userId:number, productId:string}){
        this.userId = userId,
        this.productId = productId
    }
}