import { ProductType } from '@prisma/client';
import { prisma } from '../database/init.postgresql';
import { BadRequestError } from "../core/error.response";
import { removeUndefinedObject, flattenNestedObject } from "../shared/utils";
import { 
    findAll,
    publish,

    searchProductByUser,
    findAllProducts,
    findProduct,
//     updateProductById,
} from "../repositories/product.repository";
// import { insertInventory } from "../models/repository/inventory.repository";
// import { Notifications } from "./notification.service";

import { CreateProductDTO } from "../dto/product.dto";

interface FindAll {
    productShopId: string,  // Use UUID in Prisma/Postgres
    skip?: number,
    take?: number
}

interface Publish {
    productShopId: string;  // UUID as string
    uuid: string;    // UUID
    isDraft?: boolean;
    isPublished?: boolean;
}

class Factory {
    private static productRegistry: { [keys: string]: any } = {}

    static registerProductType(type: string, classReference: typeof Product) {
        Factory.productRegistry[type] = classReference
    }

    static async createProduct(type: CreateProductDTO['productType'], payload: {}) {
        const productClass = Factory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).createProduct();
    }

    static async updateProduct(type: CreateProductDTO['productType'], productId: string, payload: {}) {
        const productClass = Factory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`);
        return new productClass(payload).updateProduct(productId);
    }

    // Queries
    static async findAllDraftsForShop({ productShopId, skip = 0, take = 10 }: FindAll) {
        const query = { productShopId, isDraft: true };
        return await findAll(query, skip, take);
    }

    static async findAllPublishForShop({ productShopId, skip = 0, take = 10 }: FindAll) {
        const query = { productShopId, isPublished: true };
        return await findAll( query, skip, take );
    }

    static async publishProductByShop({ productShopId, uuid, isDraft = false, isPublished = true }: Publish) {
        return await publish( productShopId, uuid, isDraft, isPublished );
    }

    static async unPublishProductByShop({ productShopId, uuid, isDraft = true, isPublished = false }: Publish) {
        return await publish( productShopId, uuid, isDraft, isPublished );
    }

    static async getListSearchProduct(keySearch: string) {
        return searchProductByUser(keySearch);
    }

    static async findAllProducts({ take = 50, skip = 0, filter = { isPublished: true } }) {
        return await findAllProducts(take, skip, filter, ['productName', 'productThumb', 'productPrice']);
    }

    static async findProduct({ productId }: { productId: string }) {
        return await findProduct(productId, ['productVariation']);
    }
}

class Product {
    productAttributes: any;
    productDescription: string;
    productName: string;
    productPrice: number;
    productQuantity: number;
    productShop: string; // Adjust according to your type
    productThumb: string;
    productType: string;

    constructor({
        productAttributes,
        productDescription,
        productName,
        productPrice,
        productQuantity,
        productShop,
        productThumb,
        productType,
    }: any) {
        this.productAttributes = productAttributes;
        this.productDescription = productDescription;
        this.productName = productName;
        this.productPrice = productPrice;
        this.productQuantity = productQuantity;
        this.productShop = productShop;
        this.productThumb = productThumb;
        this.productType = productType;
    }

    async createProduct(subClassId: string): Promise<any> {
        const newProduct = await prisma.product.create({
            data: {
                uuid: subClassId,
                productAttributes: this.productAttributes,
                productDescription: this.productDescription,
                productName: this.productName,
                productPrice: this.productPrice,
                productQuantity: this.productQuantity,
                productShopId: this.productShop,
                productThumb: this.productThumb,
                productType: this.productType as ProductType,
            }
        });

        return newProduct;
    }

    async updateProduct(productId: string, payload: object) {
        return await prisma.product.update({
            where: { uuid: productId },
            data: payload
        });
    }
}

class Clothing extends Product {
    public async createProduct() {
        const newClothing = await prisma.clothing.create({
            data: {
                ...this.productAttributes,
                productShopId: this.productShop
            }
        });
        return await super.createProduct(newClothing.uuid);
    }
    async updateProduct(productId: string) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.productAttributes) {
            await prisma.clothing.update({
                where: { uuid: productId },
                data: flattenNestedObject(objectParams.productAttributes)
            });
        }
        return await super.updateProduct(productId, objectParams);
    }
}

class Electronic extends Product {
    public async createProduct() {
        const newElectronic = await prisma.electronic.create({
            data: {
                ...this.productAttributes,
                productShopId: this.productShop
            }
        });
        return await super.createProduct(newElectronic.uuid);
    }

    async updateProduct(productId: string) {
        const objectParams = removeUndefinedObject(this);
        if (objectParams.productAttributes) {
            await prisma.electronic.update({
                where: { uuid: productId },
                data: flattenNestedObject(objectParams.productAttributes)
            });
        }
        return await super.updateProduct(productId, objectParams);
    }
}

class Furniture extends Product {
    public async createProduct() {
        const newFurniture = await prisma.furniture.create({
            data: {
                ...this.productAttributes,
                productShopId: this.productShop
            }
        });
        
        return await super.createProduct(newFurniture.uuid);
    }

    async updateProduct(productId: string) {
        const objectParams = removeUndefinedObject(this);
        console.log('flatten ', flattenNestedObject(objectParams.productAttributes))
        if (objectParams.productAttributes) {
            await prisma.furniture.update({
                where: { uuid: productId },
                data: flattenNestedObject(objectParams.productAttributes)
            });
        }
        
        return await super.updateProduct(productId, objectParams);
    }
}

const registerProduct = [
    { type: 'Clothing', class: Clothing },
    { type: 'Electronic', class: Electronic },
    { type: 'Furniture', class: Furniture }
];

registerProduct.forEach((element) => {
    Factory.registerProductType(element.type, element.class);
});

export default Factory;
