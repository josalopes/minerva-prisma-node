import { prisma } from "@/lib/prisma";

export async function getAddressByIdService(id: number) {

const address = prisma.address.findUnique({
    where: { id },
  });

  return address
}
