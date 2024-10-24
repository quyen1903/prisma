-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('CLOTHING', 'ELECTRONIC', 'FURNITURE');

-- CreateEnum
CREATE TYPE "RoleShop" AS ENUM ('SHOP', 'WRITER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "Attribute" AS ENUM ('CLOTHING', 'ELECTRONIC', 'FURNITURE');

-- CreateTable
CREATE TABLE "shops" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "roles" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_tokens" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "refreshTokensUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "key_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "permission" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_thumb" TEXT NOT NULL,
    "product_description" TEXT,
    "product_slug" TEXT,
    "product_price" DOUBLE PRECISION NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "product_type" "ProductType" NOT NULL,
    "product_shop" TEXT,
    "product_attributes" JSONB,
    "product_ratingsAverage" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "product_variation" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isDraft" BOOLEAN NOT NULL DEFAULT true,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clothes" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT,
    "material" TEXT,
    "product_shop" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clothes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "electronics" (
    "id" SERIAL NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "model" TEXT,
    "color" TEXT,
    "product_shop" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "electronics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "furnitures" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "size" TEXT,
    "material" TEXT,
    "product_shop" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "furnitures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shops_uuid_key" ON "shops"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "shops_email_key" ON "shops"("email");

-- CreateIndex
CREATE UNIQUE INDEX "key_tokens_userId_key" ON "key_tokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "products_product_shop_key" ON "products"("product_shop");

-- CreateIndex
CREATE INDEX "products_product_name_product_description_idx" ON "products"("product_name", "product_description");

-- CreateIndex
CREATE UNIQUE INDEX "clothes_product_shop_key" ON "clothes"("product_shop");

-- CreateIndex
CREATE UNIQUE INDEX "electronics_product_shop_key" ON "electronics"("product_shop");

-- CreateIndex
CREATE UNIQUE INDEX "furnitures_product_shop_key" ON "furnitures"("product_shop");

-- AddForeignKey
ALTER TABLE "key_tokens" ADD CONSTRAINT "key_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronics" ADD CONSTRAINT "electronics_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furnitures" ADD CONSTRAINT "furnitures_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
