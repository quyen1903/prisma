/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_uuid_key" ON "products"("uuid");
