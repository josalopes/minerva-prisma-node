import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteAddressService } from '@/services/addresses/delete-address'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function deleteAddress(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/org/:slug/address/:id',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Addresses'],
        summary: 'Deleta o endereço de uma entidade',
        params: z.object({
          id: z.coerce.number(),
          slug: z.string(),
        }),
        response: {},
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      const { id, slug } = request.params

      await deleteAddressService({
        id,
        slug,
        userId,
      })

      return reply.status(204).send()
    },
  )
}
