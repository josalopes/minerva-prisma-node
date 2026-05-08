/*
  Warnings:

  - You are about to drop the column `unit-price` on the `transaction_items` table. All the data in the column will be lost.
  - Added the required column `unit_price` to the `transaction_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."transaction_items" DROP COLUMN "unit-price",
ADD COLUMN     "unit_price" INTEGER NOT NULL;
