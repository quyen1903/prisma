/*
  Warnings:

  - The `order_product` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "order_product",
ADD COLUMN     "order_product" JSONB[];
