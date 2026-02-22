/*
  Warnings:

  - The primary key for the `address` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `owner_id` on the `address` table. All the data in the column will be lost.
  - The primary key for the `customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `subscription` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[organization_id,cpf_cnpj]` on the table `customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `invite` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `member` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_items" DROP CONSTRAINT "transaction_items_product_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."transaction_items" DROP CONSTRAINT "transaction_items_transaction_id_fkey";

-- DropIndex
DROP INDEX "public"."customer_cpf_cnpj_key";

-- DropIndex
DROP INDEX "public"."member_organization_id_user_id_key";

-- DropIndex
DROP INDEX "public"."user_email_key";

-- AlterTable
ALTER TABLE "public"."account" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."address" DROP CONSTRAINT "address_pkey",
DROP COLUMN "owner_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customerId" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "memberId" TEXT,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "address_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "address_id_seq";

-- AlterTable
ALTER TABLE "public"."customer" DROP CONSTRAINT "customer_pkey",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "customer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "customer_id_seq";

-- AlterTable
ALTER TABLE "public"."invite" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."member" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."organization" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."product" DROP CONSTRAINT "product_pkey",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "product_id_seq";

-- AlterTable
ALTER TABLE "public"."project" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."subscription" DROP CONSTRAINT "subscription_pkey",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "subscription_id_seq";

-- AlterTable
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_pkey",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "customer_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "transaction_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "transaction_id_seq";

-- AlterTable
ALTER TABLE "public"."transaction_items" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ALTER COLUMN "transaction_id" SET DATA TYPE TEXT,
ALTER COLUMN "product_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."user" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "address_organizationId_idx" ON "public"."address"("organizationId");

-- CreateIndex
CREATE INDEX "address_memberId_idx" ON "public"."address"("memberId");

-- CreateIndex
CREATE INDEX "address_customerId_idx" ON "public"."address"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "customer_organization_id_cpf_cnpj_key" ON "public"."customer"("organization_id", "cpf_cnpj");

-- CreateIndex
CREATE INDEX "member_organization_id_idx" ON "public"."member"("organization_id");

-- CreateIndex
CREATE INDEX "member_user_id_idx" ON "public"."member"("user_id");

-- CreateIndex
CREATE INDEX "organization_user_id_idx" ON "public"."organization"("user_id");

-- CreateIndex
CREATE INDEX "transaction_organization_id_idx" ON "public"."transaction"("organization_id");

-- CreateIndex
CREATE INDEX "transaction_customer_id_idx" ON "public"."transaction"("customer_id");

CREATE UNIQUE INDEX "user_email_active_idx" ON "public"."user"("email") WHERE "deleted_at" IS NULL;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_items" ADD CONSTRAINT "transaction_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
