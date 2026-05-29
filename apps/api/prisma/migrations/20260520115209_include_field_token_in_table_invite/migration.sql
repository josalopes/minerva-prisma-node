/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `invite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."invite_email_idx";

-- DropIndex
DROP INDEX "public"."invite_email_organization_id_key";

-- AlterTable
ALTER TABLE "public"."invite" DROP COLUMN "deleted_at",
ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invite_token_key" ON "public"."invite"("token");

-- CreateIndex
CREATE INDEX "transaction_items_product_id_idx" ON "public"."transaction_items"("product_id");
