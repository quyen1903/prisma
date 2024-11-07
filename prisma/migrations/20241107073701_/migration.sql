/*
  Warnings:

  - You are about to drop the column `brand` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `product_shop` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `clothes` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `manufacturer` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `product_shop` on the `electronics` table. All the data in the column will be lost.
  - You are about to drop the column `brand` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `product_shop` on the `furnitures` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `furnitures` table. All the data in the column will be lost.
  - Added the required column `clothing_brand` to the `clothes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clothing_material` to the `clothes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clothing_size` to the `clothes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `clothes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electronic_color` to the `electronics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electronic_manufacturer` to the `electronics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `electronic_model` to the `electronics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `electronics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `furniture_brand` to the `furnitures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `furniture_material` to the `furnitures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `furniture_size` to the `furnitures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `furnitures` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "clothes" DROP CONSTRAINT "clothes_product_shop_fkey";

-- DropForeignKey
ALTER TABLE "electronics" DROP CONSTRAINT "electronics_product_shop_fkey";

-- DropForeignKey
ALTER TABLE "furnitures" DROP CONSTRAINT "furnitures_product_shop_fkey";

-- AlterTable
ALTER TABLE "clothes" DROP COLUMN "brand",
DROP COLUMN "material",
DROP COLUMN "product_shop",
DROP COLUMN "size",
ADD COLUMN     "clothing_brand" TEXT NOT NULL,
ADD COLUMN     "clothing_material" TEXT NOT NULL,
ADD COLUMN     "clothing_size" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "electronics" DROP COLUMN "color",
DROP COLUMN "manufacturer",
DROP COLUMN "model",
DROP COLUMN "product_shop",
ADD COLUMN     "electronic_color" TEXT NOT NULL,
ADD COLUMN     "electronic_manufacturer" TEXT NOT NULL,
ADD COLUMN     "electronic_model" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "furnitures" DROP COLUMN "brand",
DROP COLUMN "material",
DROP COLUMN "product_shop",
DROP COLUMN "size",
ADD COLUMN     "furniture_brand" TEXT NOT NULL,
ADD COLUMN     "furniture_material" TEXT NOT NULL,
ADD COLUMN     "furniture_size" TEXT NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "clothes" ADD CONSTRAINT "clothes_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "electronics" ADD CONSTRAINT "electronics_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "furnitures" ADD CONSTRAINT "furnitures_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
