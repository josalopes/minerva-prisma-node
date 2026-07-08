-- AlterTable
ALTER TABLE "public"."audit-log" ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "userAgent" TEXT;
