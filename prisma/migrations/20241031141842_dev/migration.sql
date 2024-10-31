/*
  Warnings:

  - You are about to drop the column `key_user` on the `key_tokens` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "key_tokens" DROP CONSTRAINT "key_tokens_key_user_fkey";

-- DropIndex
DROP INDEX "key_tokens_key_user_key";

-- AlterTable
ALTER TABLE "key_tokens" DROP COLUMN "key_user";
