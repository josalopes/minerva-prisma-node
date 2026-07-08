import { prisma } from '@/lib/prisma'
import z from 'zod'

import { AddressOwnerType, AddressType } from '@prisma/client'
import { setPrimaryAddressService } from './set-primary-address'
import { audit, AuditAction, AuditEntity } from '../audit'
import { createLogger } from '@/lib/logger'
import { BadRequestError } from '@/http/routes/-errors/bad-request-error'
import { addressEntitySchema, updateAddressSchema } from '@saas/contracts'

type UpdateAddressRequest =
  z.infer<typeof updateAddressSchema>

type UpdateAddressResponse =
  z.infer<typeof addressEntitySchema>

const logger = createLogger("address")

export async function updateAddressService(
    data: UpdateAddressRequest,
    id: number,
    slug: string,
    userId: string 
  ): Promise<UpdateAddressResponse> {

    
    
    return await prisma.$transaction(async (tx) => {
      
      const organization = await tx.organization.findUnique({
      where: {
        slug,
      },
    })
    
    if (!organization) {
      throw new BadRequestError("Organização não encontrada.")
    }
    
    const organizationId = organization.id  
    
    const address = await tx.address.update({
      where: {
        id,
      },
      data: {
        street: data.street,
        number: data.number,
        complement: data.complement,
        district: data.district,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isPrimary: data.isPrimary,
        type: data.type,
      },
    })
    
    await setPrimaryAddressService({
      ownerType: address.ownerType, 
      ownerId: address.ownerId, 
      addressId: id
    }, tx)
    
    logger.info(
      {
        addressId: address.id,
        ownerId: address.ownerId,
      },
      "Address updated"
    )

    await audit.create(
      {
        organizationId,
        userId,
        entity: AuditEntity.ADDRESS,
        entityId: id.toString(),
        action: AuditAction.UPDATE,
        description: "Endereço atualizado.",
      },
      tx,
    )

    return address
  }
)}