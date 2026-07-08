-- AlterTable
ALTER TABLE "public"."invite" ADD COLUMN     "accepted_user_id" TEXT,
ADD COLUMN     "message" TEXT,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "invite_organization_id_idx" ON "public"."invite"("organization_id");

-- CreateIndex
CREATE INDEX "invite_email_idx" ON "public"."invite"("email");

-- AddForeignKey
ALTER TABLE "public"."invite" ADD CONSTRAINT "invite_accepted_user_id_fkey" FOREIGN KEY ("accepted_user_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
