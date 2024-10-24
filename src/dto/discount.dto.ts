import { IsNotEmpty, IsInt, IsString, IsArray, ArrayMinSize, IsBoolean, ValidateNested, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

enum AppliesTo {
    ALL = 'all',
    SPECIFIC = 'specific',
}

export class CreateDiscountDTO {
    @IsNotEmpty()
    @IsString()
    discountName: string;

    @IsString()
    discountDescription: string;

    @IsNotEmpty()
    @IsString()
    discountType: string;

    @IsInt()
    @IsNotEmpty()
    discountValue: number;

    @IsNotEmpty()
    @IsString()
    discountCode: string;

    @IsNumber()
    @IsNotEmpty()
    discountMaxValue: number;

    @IsString()
    @IsNotEmpty()
    discountStartDate: string;

    @IsString()
    @IsNotEmpty()
    discountEndDate: string;

    @IsInt()
    @IsNotEmpty()
    discountMaxUses: number;

    @IsInt()
    @IsNotEmpty()
    discountUsesCount: number;

    @IsArray()
    @IsString({ each: true })
    @ArrayMinSize(1)
    discountUsersUsed: string[];

    @IsInt()
    @IsNotEmpty()
    discountMaxUsesPerUser: number;

    @IsInt()
    @IsNotEmpty()
    discountMinOrderValue: number;

    @IsBoolean()
    discountIsActive: boolean;

    @IsNotEmpty()
    @IsEnum(AppliesTo)
    discountAppliesTo: AppliesTo;

    @IsArray()
    @IsString({ each: true })  // "each" tells class-validator to run the validation on each item of the array
    @ArrayMinSize(1)
    discountProductIds: string[];

    constructor({
        discountName,
        discountDescription,
        discountType,
        discountValue,
        discountCode,
        discountMaxValue,
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
    }: {
        discountName: string;
        discountDescription: string;
        discountType: string;
        discountValue: number;
        discountCode: string;
        discountMaxValue: number;
        discountStartDate: string;
        discountEndDate: string;
        discountMaxUses: number;
        discountUsesCount: number;
        discountUsersUsed: string[];
        discountMaxUsesPerUser: number;
        discountMinOrderValue: number;
        discountIsActive: boolean;
        discountAppliesTo: AppliesTo;
        discountProductIds: string[];
    }) {
        this.discountName = discountName;
        this.discountDescription = discountDescription;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.discountCode = discountCode;
        this.discountMaxValue = discountMaxValue;
        this.discountStartDate = discountStartDate;
        this.discountEndDate = discountEndDate;
        this.discountMaxUses = discountMaxUses;
        this.discountUsesCount = discountUsesCount;
        this.discountUsersUsed = discountUsersUsed;
        this.discountMaxUsesPerUser = discountMaxUsesPerUser;
        this.discountMinOrderValue = discountMinOrderValue;
        this.discountIsActive = discountIsActive;
        this.discountAppliesTo = discountAppliesTo;
        this.discountProductIds = discountProductIds;
    }
}

class Product {
    @IsNotEmpty()
    @IsString()
    discountProductId: string;

    @IsInt()
    @IsNotEmpty()
    discountQuantity: number;

    @IsNumber()
    @IsNotEmpty()
    discountPrice: number;
}

export class AmountDiscountDTO {
    @IsString()
    @IsNotEmpty()
    discountCode: string;

    @IsString()
    @IsNotEmpty()
    discountUserId: string;

    @IsString()
    @IsNotEmpty()
    discountShopId: string;

    @IsArray()
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => Product)
    discountProducts: Product[];

    constructor({
        discountCode,
        discountUserId,
        discountShopId,
        discountProducts,
    }: {
        discountCode: string;
        discountUserId: string;
        discountShopId: string;
        discountProducts: Product[];
    }) {
        this.discountCode = discountCode;
        this.discountUserId = discountUserId;
        this.discountShopId = discountShopId;
        this.discountProducts = discountProducts;
    }
}

export class GetListDiscount {
    @IsString()
    @IsNotEmpty()
    discountCode: string;

    @IsString()
    @IsNotEmpty()
    discountShopId: string;

    @IsInt()
    @IsNotEmpty()
    discountLimit: number;

    @IsInt()
    @IsNotEmpty()
    discountPage: number;

    constructor({
        discountCode,
        discountShopId,
        discountLimit,
        discountPage,
    }: {
        discountCode: string;
        discountShopId: string;
        discountLimit: number;
        discountPage: number;
    }) {
        this.discountCode = discountCode;
        this.discountShopId = discountShopId;
        this.discountLimit = discountLimit;
        this.discountPage = discountPage;
    }
}
