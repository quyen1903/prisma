/*
  Warnings:

  - A unique constraint covering the columns `[cart_userId]` on the table `carts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "carts_cart_userId_key" ON "carts"("cart_userId");
