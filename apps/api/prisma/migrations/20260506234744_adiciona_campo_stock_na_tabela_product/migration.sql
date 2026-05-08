-- AlterTable
ALTER TABLE "public"."product" ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "project_organization_id_idx" ON "public"."project"("organization_id");
