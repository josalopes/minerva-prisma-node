/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "avatar_url",
ADD COLUMN     "image_url" TEXT;
