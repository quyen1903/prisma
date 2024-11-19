/*
  Warnings:

  - You are about to drop the column `publicKey` on the `shop_key_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `shop_key_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `user_key_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user_key_tokens` table. All the data in the column will be lost.
  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `shop_public_key` to the `shop_key_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shop_refresh_token` to the `shop_key_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_public_key` to the `user_key_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_refresh_token` to the `user_key_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "order" DROP CONSTRAINT "order_order_userId_fkey";

-- AlterTable
ALTER TABLE "shop_key_tokens" DROP COLUMN "publicKey",
DROP COLUMN "refreshToken",
ADD COLUMN     "shop_public_key" TEXT NOT NULL,
ADD COLUMN     "shop_refresh_token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_key_tokens" DROP COLUMN "publicKey",
DROP COLUMN "refreshToken",
ADD COLUMN     "user_public_key" TEXT NOT NULL,
ADD COLUMN     "user_refresh_token" TEXT NOT NULL;

-- DropTable
DROP TABLE "order";

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "order_userId" TEXT NOT NULL,
    "order_checkout" JSONB NOT NULL,
    "order_payment" JSONB NOT NULL,
    "order_product" TEXT[],
    "order_tracking_number" TEXT NOT NULL,
    "order_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" TEXT NOT NULL,
    "comment_product" TEXT NOT NULL,
    "comment_user" TEXT NOT NULL,
    "comment_content" TEXT NOT NULL,
    "comment_left" INTEGER NOT NULL,
    "comment_right" INTEGER NOT NULL,
    "comment_parent_id" TEXT NOT NULL,
    "is_deleted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_userId_key" ON "orders"("order_userId");

-- CreateIndex
CREATE UNIQUE INDEX "comments_id_key" ON "comments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "comments_comment_product_key" ON "comments"("comment_product");

-- CreateIndex
CREATE UNIQUE INDEX "comments_comment_user_key" ON "comments"("comment_user");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_userId_fkey" FOREIGN KEY ("order_userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_product_fkey" FOREIGN KEY ("comment_product") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_comment_user_fkey" FOREIGN KEY ("comment_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
