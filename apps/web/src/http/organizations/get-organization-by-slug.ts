import { api } from '../api-client'
import { GetOrganizationBySlugResponse } from '@saas/contracts/organization'

export async function getOrganizationBySlug(slug: string) {
  const response = await api
    .get(`organization/slug/${slug}`)
    .json<GetOrganizationBySlugResponse>()

  return response.organization
}
