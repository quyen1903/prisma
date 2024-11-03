-- CreateEnum
CREATE TYPE "CartState" AS ENUM ('ACTIVE', 'COMPLETE', 'FAIL', 'PENDING');

-- CreateEnum
CREATE TYPE "RoleShop" AS ENUM ('SHOP', 'WRITER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('Clothing', 'Electronic', 'Furniture');

-- CreateEnum
CREATE TYPE "DiscountAppliesTo" AS ENUM ('all', 'specific');

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "shop_name" TEXT NOT NULL,
    "shop_email" TEXT NOT NULL,
    "shop_password" TEXT NOT NULL,
    "shop_salt" TEXT NOT NULL,
    "shop_role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_tokens" (
    "id" TEXT NOT NULL,
    "key_shop" TEXT NOT NULL,
    "key_user" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "refreshTokensUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refreshToken" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "key_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "permission" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_thumb" TEXT NOT NULL,
    "product_description" TEXT,
    "product_slug" TEXT,
    "product_price" DOUBLE PRECISION NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_type" "ProductType" NOT NULL,
    "product_shop" TEXT NOT NULL,
    "product_attributes" JSONB,
    "product_ratingsAverage" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "product_variation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothes" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "product_shop" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clothes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electronics" (
    "id" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "product_shop" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electronics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "furnitures" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "product_shop" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "furnitures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "discount_name" TEXT NOT NULL,
    "discount_description" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL DEFAULT 'fixed_amount',
    "discount_value" DOUBLE PRECISION NOT NULL,
    "discount_code" TEXT NOT NULL,
    "discount_start_dates" TIMESTAMP(3) NOT NULL,
    "discount_end_dates" TIMESTAMP(3) NOT NULL,
    "discount_max_uses" INTEGER NOT NULL,
    "discount_uses_count" INTEGER NOT NULL,
    "discount_users_used" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "discount_max_uses_per_user" INTEGER NOT NULL,
    "discount_min_order_value" DOUBLE PRECISION NOT NULL,
    "discount_shop" TEXT NOT NULL,
    "discount_is_active" BOOLEAN NOT NULL DEFAULT true,
    "discount_applies_to" "DiscountAppliesTo" NOT NULL,
    "discount_product_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "cart_state" "CartState" NOT NULL DEFAULT 'ACTIVE',
    "cart_count_product" INTEGER NOT NULL DEFAULT 0,
    "cart_userId" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedOn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_products" (
    "id" TEXT NOT NULL,
    "cart_product_productId" TEXT NOT NULL,
    "cart_product_shopId" TEXT NOT NULL,
    "cart_product_quantity" INTEGER NOT NULL,
    "cart_product_name" TEXT NOT NULL,
    "cart_product_price" DOUBLE PRECISION NOT NULL,
    "cart_product_cartId" TEXT,

    CONSTRAINT "cart_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_password" TEXT NOT NULL,
    "user_salt" TEXT NOT NULL,
    "user_phone" TEXT NOT NULL,
    "user_sex" TEXT NOT NULL,
    "user_avatar" TEXT NOT NULL,
    "user_date_of_birth" TIMESTAMP(3) NOT NULL,
    "user_status" "Status" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shops_id_key" ON "shops"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shops_shop_email_key" ON "shops"("shop_email");

-- CreateIndex
CREATE UNIQUE INDEX "key_tokens_id_key" ON "key_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "key_tokens_key_shop_key" ON "key_tokens"("key_shop");

-- CreateIndex
CREATE UNIQUE INDEX "key_tokens_key_user_key" ON "key_tokens"("key_user");

-- CreateIndex
CREATE UNIQUE INDEX "api_keys_id_key" ON "api_keys"("id");

-- CreateIndex
CREATE UNIQUE INDEX "products_id_key" ON "products"("id");

-- CreateIndex
CREATE INDEX "products_product_name_product_description_idx" ON "products"("product_name", "product_description");

-- CreateIndex
CREATE UNIQUE INDEX "clothes_id_key" ON "clothes"("id");

-- CreateIndex
CREATE UNIQUE INDEX "electronics_id_key" ON "electronics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "furnitures_id_key" ON "furnitures"("id");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_id_key" ON "discounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_discount_code_key" ON "discounts"("discount_code");

-- CreateIndex
CREATE UNIQUE INDEX "carts_id_key" ON "carts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_products_id_key" ON "cart_products"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_email_key" ON "users"("user_email");

-- AddForeignKey
ALTER TABLE "key_tokens" ADD CONSTRAINT "key_tokens_key_shop_fkey" FOREIGN KEY ("key_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_tokens" ADD CONSTRAINT "key_tokens_key_user_fkey" FOREIGN KEY ("key_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronics" ADD CONSTRAINT "electronics_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furnitures" ADD CONSTRAINT "furnitures_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_discount_shop_fkey" FOREIGN KEY ("discount_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_cart_product_cartId_fkey" FOREIGN KEY ("cart_product_cartId") REFERENCES "carts"("id") ON DELETE SET NULL ON UPDATE CASCADE;