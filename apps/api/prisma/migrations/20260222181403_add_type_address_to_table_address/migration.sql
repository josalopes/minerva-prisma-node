-- CreateEnum
CREATE TYPE "public"."AddressOwnerType" AS ENUM ('ORGANIZATION', 'CUSTOMER', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."AddressType" AS ENUM ('GENERAL', 'BILLING', 'SHIPPING');

-- AlterTable
ALTER TABLE "public"."address" ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "type" "public"."AddressType" NOT NULL DEFAULT 'GENERAL';

-- CreateIndex
CREATE INDEX "customer_organization_id_name_idx" ON "public"."customer"("organization_id", "name");

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
