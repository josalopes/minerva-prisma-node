import { Organization } from '@saas/contracts/organization'
import { prisma } from '@/lib/prisma'
import { audit, AuditAction, AuditEntity } from '../audit'
import { RequestContext } from '@/http/request-context'

interface UpdateOrganizationRequest {
  name?: string
  domain?: string | undefined
  shouldAttachUserByDomain?: boolean
}

export async function updateOrganizationService(
  organizationId: string,
  userId: string,
  data: UpdateOrganizationRequest,
  context?: RequestContext,
): Promise<Organization> {
  return await prisma.$transaction(async (tx) => {
    const response = await prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: {
        name: data.name,
        domain: data.domain,
        shouldAttachUserByDomain: data.shouldAttachUserByDomain,
      },
    })

    await audit.create(
      {
        organizationId,
        userId,
        entity: AuditEntity.ORGANIZATION,
        entityId: response.id,
        action: AuditAction.UPDATE,
        description: `Organização "${response.name}" atualizada.`,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent,
      },
      tx,
    )

    return response
  })
}
