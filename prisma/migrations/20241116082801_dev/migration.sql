/*
  Warnings:

  - A unique constraint covering the columns `[order_userId]` on the table `order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "order_order_userId_key" ON "order"("order_userId");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_order_userId_fkey" FOREIGN KEY ("order_userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
