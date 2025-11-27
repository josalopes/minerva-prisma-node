/*
  Warnings:

  - You are about to drop the column `login_code` on the `organization` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."organization_login_code_key";

-- AlterTable
ALTER TABLE "public"."organization" DROP COLUMN "login_code";
