/*
  Warnings:

  - Made the column `product_attributes` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "product_attributes" SET NOT NULL;
