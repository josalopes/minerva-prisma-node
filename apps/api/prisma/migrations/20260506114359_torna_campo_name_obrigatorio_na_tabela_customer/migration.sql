/*
  Warnings:

  - Made the column `name` on table `customer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."customer" ALTER COLUMN "name" SET NOT NULL;
