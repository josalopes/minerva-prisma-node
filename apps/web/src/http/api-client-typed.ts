import z from 'zod'
import { api } from './api-client'
import { apiRequest } from './api-request'
import { apiSuccessSchema } from './api-types'

import {
  organizationSchema,
  organizationsListSchema,
} from '@/schemas/organization'
import { CreateOrganizationInput } from '@saas/contracts/organization'

export const apiClient = {
  organizations: {
    async get() {
      const schema = apiSuccessSchema(organizationsListSchema)

      const data = await apiRequest(
        api.get('organizations', {
          next: { tags: ['organizations'] },
        }),
        schema,
      )

      return data
    },

    async create(data: CreateOrganizationInput) {
      const schema = apiSuccessSchema(
        z.object({
          organization: organizationSchema,
        }),
      )

      const result = await apiRequest(
        api.post('organization', { json: data }),
        schema,
      )

      console.log('retornado da apiRequest', result)

      return result
    },

    async update(data: {
      slug: string
      name: string
      domain?: string
      shouldAttachUserByDomain?: boolean
    }) {
      const schema = apiSuccessSchema(organizationSchema)

      return apiRequest(api.put('organization', { json: data }), schema)
    },
  },
}
