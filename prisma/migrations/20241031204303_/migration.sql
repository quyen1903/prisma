/*
  Warnings:

  - A unique constraint covering the columns `[cart_product_productId]` on the table `cart_products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cart_products_cart_product_productId_key" ON "cart_products"("cart_product_productId");
