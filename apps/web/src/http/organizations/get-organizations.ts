import { api } from '../api-client'

export interface ApiSuccess<T> {
  success: true
  data: T
}

interface Organization {
  id: string
  name: string
  slug: string
  avatarUrl: string | null
}

interface GetOrganizationsData {
  organizations: Organization[]
}

export async function getOrganizations(): Promise<Organization[]> {
  const result = await api
    .get('organizations', {
      next: {
        tags: ['organizations'],
      },
    })
    .json<ApiSuccess<GetOrganizationsData>>()

  return result.data.organizations
}
