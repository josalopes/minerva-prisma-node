/*
  Warnings:

  - Made the column `password_hash` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "password_hash" SET NOT NULL;
