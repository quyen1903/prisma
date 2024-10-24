/*
  Warnings:

  - The values [spesific] on the enum `DiscountAppliesTo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DiscountAppliesTo_new" AS ENUM ('all', 'specific');
ALTER TABLE "Discount" ALTER COLUMN "DiscountAppliesTo" TYPE "DiscountAppliesTo_new" USING ("DiscountAppliesTo"::text::"DiscountAppliesTo_new");
ALTER TYPE "DiscountAppliesTo" RENAME TO "DiscountAppliesTo_old";
ALTER TYPE "DiscountAppliesTo_new" RENAME TO "DiscountAppliesTo";
DROP TYPE "DiscountAppliesTo_old";
COMMIT;
