import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getAddressesService } from '@/services/addresses/get-addresses'
import { addressEntitySchema, addressOwnerTypeSchema } from '@saas/contracts'

export async function getAddresses(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/org/:slug/addresses',
    {
      schema: {
        tags: ['Addresses'],
        summary: 'Obtém os endereços de uma entidade',
        response: {
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          200: z.array(addressEntitySchema),
        },
      },
    },
    async (request, reply) => {
      const querySchema = z.object({
        ownerType: addressOwnerTypeSchema,
        ownerId: z.string(),
      })

      const { ownerType, ownerId } = querySchema.parse(request.query)

      const addresses = await getAddressesService(ownerType, ownerId)

      return reply.status(200).send(addresses)
    }
  )
}
