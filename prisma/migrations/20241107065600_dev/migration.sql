/*
  Warnings:

  - You are about to drop the column `inventory_shop_id` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_inventory_shop_id_fkey";

-- DropIndex
DROP INDEX "Inventory_inventory_shop_id_key";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "inventory_shop_id";
