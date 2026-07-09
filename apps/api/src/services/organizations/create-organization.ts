import { prisma } from '@/lib/prisma'
import { PersonType } from '@prisma/client'
import { audit, AuditAction, AuditEntity } from '../audit'
import { RequestContext } from '@/http/request-context'
import { createLogger } from '@/lib/logger'

interface CreateOrganizationRequest {
  name: string
  cpfCnpj: string
  domain?: string | undefined
  shouldAttachUserByDomain?: boolean
  personType: PersonType
}
interface CreateOrganizationResponse {
  id: string
  slug: string
  name: string
  cpfCnpj: string
  domain: string | null | undefined
  personType: PersonType
  shouldAttachUserByDomain: boolean
}

const logger = createLogger('organization')

export async function createOrganizationService(
  slug: string,
  userId: string,
  data: CreateOrganizationRequest,
  context?: RequestContext,
): Promise<CreateOrganizationResponse> {
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
