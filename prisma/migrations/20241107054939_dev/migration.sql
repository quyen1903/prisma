/*
  Warnings:

  - The `inventory_reservations` column on the `Inventory` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Reservations" AS ENUM ('quantity', 'cartId');

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "inventory_reservations",
ADD COLUMN     "inventory_reservations" "Reservations"[];
