import { prisma } from '../../lib/prisma'

export async function setPrimaryAddress(
  ownerType: string,
  ownerId: string,
  addressId: number
) {
  await prisma.$transaction([
    prisma.address.updateMany({
      where: {
        ownerType,
        ownerId,
      },
      data: {
        isPrimary: false,
      },
    }),
    prisma.address.update({
      where: { id: addressId },
      data: {
        isPrimary: true,
      },
    }),
  ])
}