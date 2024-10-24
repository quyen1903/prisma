/*
  Warnings:

  - A unique constraint covering the columns `[discount_code]` on the table `Discount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Discount_discount_code_key" ON "Discount"("discount_code");
