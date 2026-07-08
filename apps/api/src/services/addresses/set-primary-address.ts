import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

import { AddressOwnerType } from '@prisma/client'
import { audit, AuditAction, AuditEntity } from '../audit'
import { logger } from '@/lib/logger'

type SetPrimaryParams = {
  ownerType: AddressOwnerType
  ownerId: string
  addressId: number
  userId: string
  organizationId: string | undefined
}

export async function setPrimaryAddressService(
  { ownerType, ownerId, addressId, userId, organizationId }: SetPrimaryParams,
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
    throw new Error('Endereço não encontrado.')
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

  logger.info(
    {
      addressId: address.id,
      ownerId: address.ownerId,
    },
    'Address updated',
  )

  await audit.create(
    {
      organizationId,
      userId,
      entity: AuditEntity.ADDRESS,
      entityId: addressId.toString(),
      action: AuditAction.UPDATE,
      description: 'Endereço atualizado.',
    },
    tx,
  )
}
