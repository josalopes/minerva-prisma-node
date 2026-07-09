import { api } from '@/http/api-client'
import { apiRequest } from '@/http/api-request'
import { apiSuccessSchema } from '@/http/api-types'

import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '@saas/contracts/src/organization.schema'

import {
  organizationEntitySchema,
  organizationsListSchema,
} from '@saas/contracts/organization'

export const organizationsClient = {
  async get() {
    const schema = apiSuccessSchema(organizationsListSchema)

    const data = await apiRequest(api.get('organizations'), schema)

    return data
  },

  async create(data: CreateOrganizationInput) {
    const schema = apiSuccessSchema(organizationEntitySchema)

    const result = await apiRequest(
      api.post('organization', { json: data }),
      schema,
    )

    return result.data
  },

  async update(data: UpdateOrganizationInput) {
    const schema = apiSuccessSchema(organizationEntitySchema)

    const slug = data.slug

    const result = await apiRequest(
      api.patch(`organization/${slug}`, { json: data }),
      schema,
    )

    return result.data
  },
}
