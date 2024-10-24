/*
  Warnings:

  - You are about to drop the `Discount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Discount" DROP CONSTRAINT "Discount_discount_shopId_fkey";

-- DropTable
DROP TABLE "Discount";

-- CreateTable
CREATE TABLE "discounts" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
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
    "discount_shopId" TEXT NOT NULL,
    "discount_is_active" BOOLEAN NOT NULL DEFAULT true,
    "DiscountAppliesTo" "DiscountAppliesTo" NOT NULL,
    "discount_product_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discounts_uuid_key" ON "discounts"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "discounts_discount_code_key" ON "discounts"("discount_code");

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_discount_shopId_fkey" FOREIGN KEY ("discount_shopId") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
