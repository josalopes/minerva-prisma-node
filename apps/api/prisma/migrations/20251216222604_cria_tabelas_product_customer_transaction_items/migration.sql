-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('COMPRA', 'VENDA');

-- CreateEnum
CREATE TYPE "public"."ProductUnit" AS ENUM ('kilo', 'litro');

-- CreateTable
CREATE TABLE "public"."product" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "measure_unit" "public"."ProductUnit" NOT NULL DEFAULT 'kilo',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "organization_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "cpf_cnpj" TEXT,
    "code" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "transactionType" "public"."TransactionType" NOT NULL,
    "totalValue" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."transaction_items" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "transaction_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "product_organization_id_code_key" ON "public"."product"("organization_id", "code");

-- CreateIndex
CREATE UNIQUE INDEX "customer_cpf_cnpj_key" ON "public"."customer"("cpf_cnpj");

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer" ADD CONSTRAINT "customer_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction" ADD CONSTRAINT "transaction_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_items" ADD CONSTRAINT "transaction_items_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."transaction_items" ADD CONSTRAINT "transaction_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
