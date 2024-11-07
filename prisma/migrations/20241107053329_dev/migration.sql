-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "inventory_product_id" TEXT NOT NULL,
    "inventory_location" TEXT NOT NULL DEFAULT 'unKnow',
    "inventory_stock" INTEGER NOT NULL,
    "inventory_shop_id" TEXT NOT NULL,
    "inventory_reservations" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_id_key" ON "Inventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_inventory_product_id_key" ON "Inventory"("inventory_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_inventory_shop_id_key" ON "Inventory"("inventory_shop_id");

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_inventory_product_id_fkey" FOREIGN KEY ("inventory_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_inventory_shop_id_fkey" FOREIGN KEY ("inventory_shop_id") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
