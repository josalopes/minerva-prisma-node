import { prisma } from "@/lib/prisma";
import { AddressOwnerType } from "@prisma/client"

export async function getAddressesService(
  ownerType: AddressOwnerType,
  ownerId: string
) {
  const where =
    ownerType === "ORGANIZATION"
      ? { organizationId: ownerId }
      : { memberId: ownerId };

return prisma.address.findMany({
    where,
    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}
