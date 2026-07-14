import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { successResponseSchema } from '@/lib/api-response'
import { setPrimaryAddressService } from '@/services/addresses/set-primary-address'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { addressOwnerTypeSchema } from '@saas/contracts'
import { getOrganizationBySlugService } from '@/services/organizations/get-organization-by-slug'

export async function setPrimary(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/org/:slug/address/:id/primary',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Addresses'],
        summary: 'Converte o endereço em principal',
        body: z.object({
          ownerId: z.string(),
          ownerType: addressOwnerTypeSchema,
        }),
        params: z.object({
          slug: z.string(),
          id: z.coerce.number(),
        }),
        response: {
          200: successResponseSchema(z.object({})),
        },
      },
    },
    async (request, reply) => {
      const { id, slug } = request.params

      const userId = await request.getCurrentUserId()

      const organization = await getOrganizationBySlugService(slug)
      const organizationId = organization.id

      const { ownerId, ownerType } = request.body

      await setPrimaryAddressService({
        ownerType,
        ownerId,
        addressId: id,
        userId,
        organizationId,
      })

      return reply.status(200).send({
        success: true,
        data: {},
      })
    },
  )
}
