import { AddressOwnerType } from '@prisma/client'
import { prisma } from '../lib/prisma'

export const addressRepository = {
  create: (data: any) => prisma.address.create({ data }),

  update: (id: number, data: any) =>
    prisma.address.update({
      where: { id },
      data,
    }),

  delete: (id: number) =>
    prisma.address.delete({
      where: { id },
    }),

  findByOwner: (ownerType: AddressOwnerType, ownerId: string) =>
    prisma.address.findMany({
      where: {
        ownerType,
        ownerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
}
