/*
  Warnings:

  - A unique constraint covering the columns `[comment_parent_id]` on the table `comments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "comments_comment_parent_id_key" ON "comments"("comment_parent_id");
