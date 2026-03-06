import { prisma } from "@/lib/prisma";
import { AddressOwnerType } from "./types";

export async function getAddressesService(
  ownerType: AddressOwnerType,
  ownerId: string
) {
  const where =
    ownerType === "organization"
      ? { organizationId: ownerId }
      : { memberId: ownerId };

return prisma.address.findMany({
    where,
    orderBy: {
      id: "desc",
    },
  });
}
