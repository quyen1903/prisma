import {
    IsNotEmpty,
    IsOptional,
    IsNumber,
    IsString,
    IsEnum,
    ValidateNested,
    IsObject,
} from 'class-validator';
import { Clothing } from './product/clothing.products';
import { Electronics } from './product/electronic.products';
import { Furniture } from './product/furniture.products';

enum ProductType {
    CLOTHING = 'Clothing',
    ELECTRONIC = 'Electronic',
    FURNITURE = 'Furniture'
}

export class CreateProductDTO {
    @IsNotEmpty()
    @IsString()
    productName: string;

    @IsNotEmpty()
    @IsString()
    productThumb: string;

    @IsNotEmpty()
    @IsString()
    productDescription: string;

    @IsNotEmpty()
    @IsNumber()
    productPrice: number;

    @IsNotEmpty()
    @IsNumber()
    productQuantity: number;

    @IsNotEmpty()
    @IsEnum(ProductType)
    productType: ProductType;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // To recursively validate nested objects
    productAttributes: Clothing | Electronics | Furniture;

    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productAttributes,
    }: {
        productName: string;
        productThumb: string;
        productDescription: string;
        productPrice: number;
        productQuantity: number;
        productType: ProductType;
        productAttributes: Clothing | Electronics | Furniture;
    }) {
        this.productName = productName;
        this.productThumb = productThumb;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productAttributes = productAttributes;
    }
}

export class UpdateProductDTO {
    @IsOptional()
    @IsString()
    productName: string;

    @IsOptional()
    @IsString()
    productThumb: string;

    @IsOptional()
    @IsString()
    productDescription: string;

    @IsOptional()
    @IsNumber()
    productPrice: number;

    @IsOptional()
    @IsNumber()
    productQuantity: number;

    @IsOptional()
    @IsEnum(ProductType)
    productType: ProductType;

    @IsNotEmpty()
    @IsObject()
    @ValidateNested() // To recursively validate nested objects
    productAttributes?: Clothing | Electronics | Furniture;

    constructor({
        productName,
        productThumb,
        productDescription,
        productPrice,
        productQuantity,
        productType,
        productAttributes,
    }: {
        productName: string;
        productThumb: string;
        productDescription: string;
        productPrice: number;
        productQuantity: number;
        productType: ProductType;
        productAttributes: any;
    }) {
        this.productName = productName;
        this.productThumb = productThumb;
        this.productDescription = productDescription;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productType = productType;
        this.productAttributes = productAttributes
    }
}
