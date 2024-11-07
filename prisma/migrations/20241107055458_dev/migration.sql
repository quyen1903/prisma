/*
  Warnings:

  - The `inventory_reservations` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "inventory_reservations",
ADD COLUMN     "inventory_reservations" JSONB[];

-- DropEnum
DROP TYPE "Reservations";
