/*
  Warnings:

  - You are about to drop the column `cpf` on the `member` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `member` table. All the data in the column will be lost.
  - Changed the type of `ownerType` on the `address` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `invite` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."TokenType" ADD VALUE 'EMAIL_CONFIRMATION';
ALTER TYPE "public"."TokenType" ADD VALUE 'INVITE';
ALTER TYPE "public"."TokenType" ADD VALUE 'FIRST_LOGIN';

-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."address" DROP CONSTRAINT "address_organizationId_fkey";

-- DropIndex
DROP INDEX "public"."member_organization_id_idx";

-- DropIndex
DROP INDEX "public"."member_user_id_idx";

-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "ownerType",
ADD COLUMN     "ownerType" "public"."AddressOwnerType" NOT NULL;

-- AlterTable
ALTER TABLE "public"."invite" ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "status" "public"."InviteStatus" NOT NULL;

-- AlterTable
ALTER TABLE "public"."member" DROP COLUMN "cpf",
DROP COLUMN "email";

-- CreateIndex
CREATE INDEX "address_ownerType_ownerId_idx" ON "public"."address"("ownerType", "ownerId");

-- CreateIndex
CREATE INDEX "member_organization_id_user_id_idx" ON "public"."member"("organization_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
