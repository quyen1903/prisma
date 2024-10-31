/*
  Warnings:

  - Made the column `cart_product_cartId` on table `cart_products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "cart_products" DROP CONSTRAINT "cart_products_cart_product_cartId_fkey";

-- AlterTable
ALTER TABLE "cart_products" ALTER COLUMN "cart_product_cartId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_cart_product_cartId_fkey" FOREIGN KEY ("cart_product_cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
