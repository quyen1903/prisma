/*
  Warnings:

  - You are about to drop the column `uuid` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_uuid_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "uuid";
