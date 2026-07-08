import { prisma } from '@/lib/prisma'
import { PersonType } from '@prisma/client'
import { audit, AuditAction, AuditEntity } from '../audit'
import { RequestContext } from '@/http/request-context'

interface UpdateOrganizationRequest {
  name?: string
  domain?: string | undefined
  shouldAttachUserByDomain?: boolean
}
interface UpdateOrganizationResponse {
  id: string;
  slug: string;
  name: string;
  cpfCnpj: string;
  domain: string | null | undefined;
  personType: PersonType;
  shouldAttachUserByDomain: boolean;
}

export async function updateOrganizationService(
  organizationId: string, 
  userId: string, 
  data: UpdateOrganizationRequest,
  context?: RequestContext
): Promise<UpdateOrganizationResponse> {
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
        action: AuditAction.CREATE,
        description: `Organização "${response.name}" criada.`,
        ipAddress: context?.ipAddress,
        userAgent: context?.userAgent
      },
      tx,
    )

    return response
  })
}