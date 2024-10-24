/*
  Warnings:

  - Made the column `size` on table `clothes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material` on table `clothes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `electronics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `electronics` required. This step will fail if there are existing NULL values in that column.
  - Made the column `size` on table `furnitures` required. This step will fail if there are existing NULL values in that column.
  - Made the column `material` on table `furnitures` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clothes" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "material" SET NOT NULL;

-- AlterTable
ALTER TABLE "electronics" ALTER COLUMN "model" SET NOT NULL,
ALTER COLUMN "color" SET NOT NULL;

-- AlterTable
ALTER TABLE "furnitures" ALTER COLUMN "size" SET NOT NULL,
ALTER COLUMN "material" SET NOT NULL;
