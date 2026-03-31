import { prisma } from '@/lib/prisma'
import { PersonType } from '@prisma/client'

interface CreateOrganizationRequest {
  name: string
  cpfCnpj: string
  domain?: string | undefined
  shouldAttachUserByDomain?: boolean
  personType: PersonType
}
interface CreateOrganizationResponse {
  id: string;
  slug: string;
  name: string;
  cpfCnpj: string;
  domain: string | null | undefined;
  personType: PersonType;
  shouldAttachUserByDomain: boolean;
}

export async function createOrganizationService(
    slug: string, 
    userId: string, 
    userEmail: string, 
    data: CreateOrganizationRequest
): Promise<CreateOrganizationResponse> {
  const organization = await prisma.$transaction(async (tx) => {
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
                    email: userEmail,
                    userId,
                    role: 'ADMIN',
                },
            },
        },
    })
    return organization
    })

  return organization
}