/*
  Warnings:

  - Changed the type of `discount_max_uses` on the `Discount` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Discount" DROP COLUMN "discount_max_uses",
ADD COLUMN     "discount_max_uses" INTEGER NOT NULL;
