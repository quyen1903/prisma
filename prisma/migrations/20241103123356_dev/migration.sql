-- DropForeignKey
ALTER TABLE "cart_products" DROP CONSTRAINT "cart_products_cart_product_cartId_fkey";

-- AddForeignKey
ALTER TABLE "cart_products" ADD CONSTRAINT "cart_products_cart_product_cartId_fkey" FOREIGN KEY ("cart_product_cartId") REFERENCES "carts"("cart_userId") ON DELETE RESTRICT ON UPDATE CASCADE;
