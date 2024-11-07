/*
  Warnings:

  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_inventory_product_id_fkey";

-- DropTable
DROP TABLE "Inventory";

-- CreateTable
CREATE TABLE "inventories" (
    "id" TEXT NOT NULL,
    "inventory_product_id" TEXT NOT NULL,
    "inventory_location" TEXT NOT NULL DEFAULT 'unKnow',
    "inventory_stock" INTEGER NOT NULL,
    "inventory_reservations" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "inventories_id_key" ON "inventories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inventories_inventory_product_id_key" ON "inventories"("inventory_product_id");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_inventory_product_id_fkey" FOREIGN KEY ("inventory_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
