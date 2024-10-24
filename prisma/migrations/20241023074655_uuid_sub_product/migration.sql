/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `clothes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `electronics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `furnitures` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `clothes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `electronics` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `furnitures` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "products_uuid_key";

-- AlterTable
ALTER TABLE "clothes" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "electronics" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "furnitures" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clothes_uuid_key" ON "clothes"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "electronics_uuid_key" ON "electronics"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "furnitures_uuid_key" ON "furnitures"("uuid");
