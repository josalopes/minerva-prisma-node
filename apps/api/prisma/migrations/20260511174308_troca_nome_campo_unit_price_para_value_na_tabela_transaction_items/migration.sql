/*
  Warnings:

  - You are about to drop the column `unit_price` on the `transaction_items` table. All the data in the column will be lost.
  - Added the required column `value` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transaction_items" DROP COLUMN "unit_price",
ADD COLUMN     "value" INTEGER NOT NULL;
