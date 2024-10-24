/*
  Warnings:

  - The values [CLOTHING,ELECTRONIC,FURNITURE] on the enum `ProductType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProductType_new" AS ENUM ('Clothing', 'Electronic', 'Furniture');
ALTER TABLE "products" ALTER COLUMN "product_type" TYPE "ProductType_new" USING ("product_type"::text::"ProductType_new");
ALTER TYPE "ProductType" RENAME TO "ProductType_old";
ALTER TYPE "ProductType_new" RENAME TO "ProductType";
DROP TYPE "ProductType_old";
COMMIT;
