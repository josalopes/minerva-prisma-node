-- AlterTable
ALTER TABLE "public"."address" ADD COLUMN     "memberId" TEXT,
ADD COLUMN     "organizationId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
