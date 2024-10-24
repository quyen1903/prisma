-- CreateEnum
CREATE TYPE "DiscountAppliesTo" AS ENUM ('all', 'spesific');

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "product_attributes" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Discount" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "discount_name" TEXT NOT NULL,
    "discount_description" TEXT NOT NULL,
    "discount_type" TEXT NOT NULL,
    "discount_value" DOUBLE PRECISION NOT NULL,
    "discount_code" TEXT NOT NULL,
    "discount_start_dates" TIMESTAMP(3) NOT NULL,
    "discount_end_dates" TIMESTAMP(3) NOT NULL,
    "discount_max_uses" TIMESTAMP(3) NOT NULL,
    "discount_uses_count" INTEGER NOT NULL,
    "discount_users_used" TEXT[],
    "discount_max_uses_per_user" INTEGER NOT NULL,
    "discount_min_order_value" DOUBLE PRECISION NOT NULL,
    "discount_shopId" TEXT NOT NULL,
    "discount_is_active" BOOLEAN NOT NULL,
    "DiscountAppliesTo" "DiscountAppliesTo" NOT NULL,
    "discount_product_ids" TEXT[],

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Discount_uuid_key" ON "Discount"("uuid");

-- AddForeignKey
ALTER TABLE "Discount" ADD CONSTRAINT "Discount_discount_shopId_fkey" FOREIGN KEY ("discount_shopId") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
