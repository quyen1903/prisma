/*
  Warnings:

  - A unique constraint covering the columns `[user_phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `user_sex` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "user_sex",
ADD COLUMN     "user_sex" "Sex" NOT NULL,
ALTER COLUMN "user_status" SET DEFAULT 'ACTIVE';

-- CreateIndex
CREATE UNIQUE INDEX "users_user_phone_key" ON "users"("user_phone");
