import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { createAddressService } from '@/services/addresses/create-address'

import { errorResponseSchema, successResponseSchema } from '@/lib/api-response'
import { addressEntitySchema } from '@saas/contracts/address'
import { createAddressSchema } from '@saas/contracts'
import { getOrganizationBySlugService } from '@/services/organizations/get-organization-by-slug'

export async function createAddress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/org/:slug/address',
    {
      schema: {
        tags: ['Addresses'],
        summary: 'Insere o endereço de uma entidade',
        params: z.object({ slug: z.string() }),
        body: createAddressSchema,
        response: {
          400: errorResponseSchema,
          401: errorResponseSchema,
          201: successResponseSchema(addressEntitySchema),
        },
      },
    },
    async (request, reply) => {
      const addr = request.body
      const { slug } = request.params
      const organization = await getOrganizationBySlugService(slug)

      const organizationId = organization.id
      const userId = await request.getCurrentUserId()

      const address = await createAddressService(
        addr,
        userId,
        organizationId ?? '',
      )

      return reply.status(201).send({
        success: true,
        data: address,
      })
    },
  )
}
