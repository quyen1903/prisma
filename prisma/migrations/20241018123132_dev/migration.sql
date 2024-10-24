/*
  Warnings:

  - You are about to drop the column `createdAt` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `key_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `key_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `shops` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `shops` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `clothes` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_shop` on table `clothes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `electronics` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_shop` on table `electronics` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `furnitures` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_shop` on table `furnitures` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `key_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `product_shop` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updated_at` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clothes" DROP CONSTRAINT "clothes_product_shop_fkey";

-- DropForeignKey
ALTER TABLE "electronics" DROP CONSTRAINT "electronics_product_shop_fkey";

-- DropForeignKey
ALTER TABLE "furnitures" DROP CONSTRAINT "furnitures_product_shop_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_product_shop_fkey";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "clothes" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "product_shop" SET NOT NULL;

-- AlterTable
ALTER TABLE "electronics" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "product_shop" SET NOT NULL;

-- AlterTable
ALTER TABLE "furnitures" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "product_shop" SET NOT NULL;

-- AlterTable
ALTER TABLE "key_tokens" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "product_shop" SET NOT NULL;

-- AlterTable
ALTER TABLE "shops" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronics" ADD CONSTRAINT "electronics_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furnitures" ADD CONSTRAINT "furnitures_product_shop_fkey" FOREIGN KEY ("product_shop") REFERENCES "shops"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
