/*
  Warnings:

  - A unique constraint covering the columns `[product_id]` on the table `clothes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `electronics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id]` on the table `furnitures` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "clothes_product_id_key" ON "clothes"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "electronics_product_id_key" ON "electronics"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "furnitures_product_id_key" ON "furnitures"("product_id");
