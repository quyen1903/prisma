/*
  Warnings:

  - The `order_status` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED', 'DELIVERED');

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "order_tracking_number" SET DEFAULT '''#0000127032024',
DROP COLUMN "order_status",
ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING';
