import { prisma } from '@/lib/prisma'
import { audit, AuditAction, AuditEntity } from '../audit'
import { RequestContext } from '@/http/request-context'
import { createLogger } from '@/lib/logger'
import {
  CreateOrganizationInput,
  Organization,
} from '@saas/contracts/organization'

const logger = createLogger('organization')

export async function createOrganizationService(
  slug: string,
  userId: string,
  data: CreateOrganizationInput,
  context?: RequestContext,
): Promise<Organization> {
  return await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: data.name,
        domain: data.domain,
        cpfCnpj: data.cpfCnpj,
        shouldAttachUserByDomain: data.shouldAttachUserByDomain ?? false,
        personType: data.personType,
        slug,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
    })

    logger.info(
      {
        organizationId: organization.id,
      },
      'Organization created',
    )

    await audit.create(
      {
        organizationId: organization.id,
        userId,
        entity: AuditEntity.ORGANIZATION,
        entityId: organization.id,
        action: AuditAction.CREATE,
        description: `Organização "${organization.name}" criada.`,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
      tx,
    )

    return organization
  })
}
