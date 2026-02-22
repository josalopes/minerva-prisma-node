-- DropForeignKey
ALTER TABLE "public"."organization" DROP CONSTRAINT "organization_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."organization" ADD COLUMN     "email" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."address" (
    "id" SERIAL NOT NULL,
    "street" TEXT,
    "number" TEXT,
    "district" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."organization" ADD CONSTRAINT "organization_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
