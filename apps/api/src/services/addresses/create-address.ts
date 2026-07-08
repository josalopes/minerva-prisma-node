import { prisma } from '@/lib/prisma'
import z from 'zod'
import { createLogger } from '@/lib/logger'

import { setPrimaryAddressService } from './set-primary-address'
import { audit, AuditAction, AuditEntity } from '../audit'
import { addressEntitySchema, createAddressSchema } from '@saas/contracts'

type CreateAddressRequest =
  z.infer<typeof createAddressSchema>

type CreateAddressResponse =
  z.infer<typeof addressEntitySchema>

const logger = createLogger("address")

export async function createAddressService(
  data: CreateAddressRequest,
  userId: string,
  organizationId: string
): Promise<CreateAddressResponse> {
  const ownerField =
    data.ownerType === "ORGANIZATION"
      ? { organizationId: data.ownerId }
      : { memberId: data.ownerId }

  return await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isPrimary: data.isPrimary,
        ownerId: data.ownerId,
        ownerType: data.ownerType,
        type: data.type,
        ...ownerField,
      },
    })

    await setPrimaryAddressService(
      {
        ownerType: address.ownerType,
        ownerId: address.ownerId,
        addressId: address.id
      },
      tx
    )

    logger.info(
      {
        addressId: address.id,
        ownerId: address.ownerId,
      },
      "Address created"
    )

    await audit.create(
      {
        organizationId,
        userId,
        entity: AuditEntity.ADDRESS,
        entityId: address.id.toString(),
        action: AuditAction.CREATE,
        description: "Endereço cadastrado.",
      },
      tx,
    )

    return address
  })
}
