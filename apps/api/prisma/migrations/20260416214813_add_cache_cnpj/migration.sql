-- CreateTable
CREATE TABLE "public"."cnpj_cache" (
    "cnpj" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cnpj_cache_pkey" PRIMARY KEY ("cnpj")
);
