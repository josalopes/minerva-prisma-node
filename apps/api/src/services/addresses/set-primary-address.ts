import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

import {OwnerType} from "../../../../web/src/types/address"

type SetPrimaryParams = {
  ownerType: OwnerType
  ownerId: string
  addressId: number
}

export async function setPrimaryAddressService({
  ownerType,
  ownerId,
  addressId
}: SetPrimaryParams,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? prisma

  const address = await db.address.findFirst({
    where: {
      id: addressId,
      ownerType,
      ownerId,
    },
  })

  if (!address) {
    throw new Error("Endereço não encontrado.")
  }

  await db.address.updateMany({
    where: {
      ownerType,
      ownerId,
    },
    data: {
      isPrimary: false,
    },
  })

  await db.address.update({
    where: {
      id: addressId,
    },
    data: {
      isPrimary: true,
    },
  })
}
