/*
  Warnings:

  - A unique constraint covering the columns `[cpf_cnpj]` on the table `organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf_cnpj` to the `organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."organization" ADD COLUMN     "cpf_cnpj" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."seed_organization" (
    "id" INTEGER NOT NULL,
    "root_val_org" INTEGER NOT NULL,

    CONSTRAINT "seed_organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."seed_user_login" (
    "id" INTEGER NOT NULL,
    "root_val_login" INTEGER NOT NULL,

    CONSTRAINT "seed_user_login_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organization_cpf_cnpj_key" ON "public"."organization"("cpf_cnpj");
