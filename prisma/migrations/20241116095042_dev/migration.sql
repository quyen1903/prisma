/*
  Warnings:

  - You are about to drop the column `order_trackingNumber` on the `order` table. All the data in the column will be lost.
  - Added the required column `order_tracking_number` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "order_trackingNumber",
ADD COLUMN     "order_tracking_number" TEXT NOT NULL;
