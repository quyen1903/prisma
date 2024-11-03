/*
  Warnings:

  - A unique constraint covering the columns `[cart_product_cartId,cart_product_productId]` on the table `cart_products` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "cart_products" DROP CONSTRAINT "cart_products_cart_product_cartId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "cart_products_cart_product_cartId_cart_product_productId_key" ON "cart_products"("cart_product_cartId", "cart_product_productId");

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_cart_product_cartId_fkey" FOREIGN KEY ("cart_product_cartId") REFERENCES "carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
