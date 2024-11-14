/*
  Warnings:

  - You are about to drop the `key_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "key_tokens" DROP CONSTRAINT "key_tokens_key_shop_fkey";

-- DropTable
DROP TABLE "key_tokens";

-- CreateTable
CREATE TABLE "shop_key_tokens" (
    "id" TEXT NOT NULL,
    "key_shop" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "refreshTokensUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "refreshToken" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_key_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_key_tokens_id_key" ON "shop_key_tokens"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shop_key_tokens_key_shop_key" ON "shop_key_tokens"("key_shop");

-- AddForeignKey
ALTER TABLE "shop_key_tokens" ADD CONSTRAINT "shop_key_tokens_key_shop_fkey" FOREIGN KEY ("key_shop") REFERENCES "shops"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
