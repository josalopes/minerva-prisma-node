import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { productUnitSchema } from '@/http/schemas'
import { updateProductService } from '@/services/products/update-product'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function updateProduct(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/organization/:slug/product/:id',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Products'],
        summary: 'Atualiza dados de um produto da organização',
        body: z.object({
          name: z.string(),
          price: z.int(),
          measureUnit: productUnitSchema,
        }),
        params: z.object({
          slug: z.string(),
          id: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug, id } = request.params

      const userId = await request.getCurrentUserId()
      const { membership } = await request.getMembership(slug)

      const { name, price, measureUnit } = request.body

      await updateProductService(userId, id, membership, {
        name,
        price,
        measureUnit,
      })

      return reply.status(204).send()
    },
  )
}
