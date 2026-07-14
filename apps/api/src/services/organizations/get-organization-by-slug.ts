import { logger } from '@/lib/logger'
import { prisma } from '@/lib/prisma'

export async function getOrganizationBySlugService(slug: string) {
  const org = await prisma.organization.findUnique({
    where: { slug },
  })

  if (!org) {
    logger.info(
      {
        slug,
      },
      'Organização não encontrada',
    )
  }

  const organization = {
    id: org?.id,
    name: org?.name,
  }

  return organization
}
