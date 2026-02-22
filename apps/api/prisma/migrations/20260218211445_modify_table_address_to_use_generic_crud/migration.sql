/*
  Warnings:

  - You are about to drop the column `customerId` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `address` table. All the data in the column will be lost.
  - Added the required column `ownerId` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerType` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_organizationId_fkey";

-- DropIndex
DROP INDEX "public"."address_customerId_idx";

-- DropIndex
DROP INDEX "public"."address_memberId_idx";

-- DropIndex
DROP INDEX "public"."address_organizationId_idx";

-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "customerId",
DROP COLUMN "memberId",
DROP COLUMN "organizationId",
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'BR',
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "ownerType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "address_ownerType_ownerId_idx" ON "public"."address"("ownerType", "ownerId");
