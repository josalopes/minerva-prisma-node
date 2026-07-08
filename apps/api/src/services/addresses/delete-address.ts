import { prisma } from '@/lib/prisma'
import { audit, AuditAction, AuditEntity } from '../audit'
import { createLogger } from '@/lib/logger'
import { BadRequestError } from '@/http/routes/-errors/bad-request-error'

interface DeleteAddressRequest {
  id: number
  slug: string
  userId: string
}

const logger = createLogger('address')

export async function deleteAddressService(data: DeleteAddressRequest) {
  return await prisma.$transaction(async (tx) => {
    const { id, slug, userId } = data

    const organization = await tx.organization.findUnique({
      where: {
        slug,
      },
    })

    if (!organization) {
      throw new BadRequestError('Organização não encontrada.')
    }

    const address = await tx.address.findUnique({
      where: {
        id,
      },
    })

    if (!address) {
      throw new BadRequestError('Endereço não encontrado.')
    }

    const ownerId = address?.ownerId
    const organizationId = organization.id

    await tx.address.delete({
      where: {
        id: data.id,
      },
    })

    logger.info(
      {
        addressId: id,
        ownerId,
      },
      'Address deleted',
    )

    await audit.create(
      {
        organizationId,
        userId,
        entity: AuditEntity.ADDRESS,
        entityId: id.toString(),
        action: AuditAction.DELETE,
        description: 'Endereço deletado.',
      },
      tx,
    )

    return address
  })
}
