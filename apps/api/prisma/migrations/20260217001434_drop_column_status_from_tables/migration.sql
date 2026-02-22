/*
  Warnings:

  - You are about to drop the column `status` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."member" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "status";
