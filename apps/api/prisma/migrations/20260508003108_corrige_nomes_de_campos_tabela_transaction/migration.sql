/*
  Warnings:

  - You are about to drop the column `totalValue` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transactionType` on the `transaction` table. All the data in the column will be lost.
  - Added the required column `total_value` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('ACTIVE', 'CANCELED');

-- AlterTable
ALTER TABLE "public"."transaction" DROP COLUMN "totalValue",
DROP COLUMN "transactionType",
ADD COLUMN     "status" "public"."TransactionStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "total_value" INTEGER NOT NULL,
ADD COLUMN     "transaction_type" "public"."TransactionType" NOT NULL;
