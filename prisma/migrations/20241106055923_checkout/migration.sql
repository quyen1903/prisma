/*
  Warnings:

  - You are about to drop the column `createdOn` on the `cart_products` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedOn` on the `cart_products` table. All the data in the column will be lost.
  - You are about to drop the column `createdOn` on the `carts` table. All the data in the column will be lost.
  - You are about to drop the column `modifiedOn` on the `carts` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `cart_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `carts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_products" DROP COLUMN "createdOn",
DROP COLUMN "modifiedOn",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "carts" DROP COLUMN "createdOn",
DROP COLUMN "modifiedOn",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "order_userId" TEXT NOT NULL,
    "order_checkout" JSONB NOT NULL,
    "order_payment" JSONB NOT NULL,
    "order_product" TEXT[],
    "order_trackingNumber" TEXT NOT NULL,
    "order_status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_key_tokens" (
    "id" TEXT NOT NULL,
    "key_user" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "refreshTokensUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refreshToken" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_key_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_id_key" ON "order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_key_tokens_id_key" ON "user_key_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_key_tokens_key_user_key" ON "user_key_tokens"("key_user");

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_cart_userId_fkey" FOREIGN KEY ("cart_userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_key_tokens" ADD CONSTRAINT "user_key_tokens_key_user_fkey" FOREIGN KEY ("key_user") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
