/*
  Warnings:

  - You are about to drop the column `customer_id` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `transaction_items` table. All the data in the column will be lost.
  - Added the required column `unit-price` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."transaction" DROP CONSTRAINT "transaction_customer_id_fkey";

-- DropIndex
DROP INDEX "public"."transaction_customer_id_idx";

-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "customer_id",
ADD COLUMN     "cpf_cnpj" TEXT;

-- AlterTable
ALTER TABLE "public"."transaction_items" DROP COLUMN "value",
ADD COLUMN     "unit-price" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "transaction_items_transaction_id_idx" ON "public"."transaction_items"("transaction_id");
