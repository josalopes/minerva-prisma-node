import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { deleteProductService } from '@/services/products/delete-product'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function deleteProduct(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/organization/:slug/product/:productCode',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Projects'],
        summary: 'Efetua soft-delete em um produto da organização',
        params: z.object({
          slug: z.string(),
          productCode: z.string(),
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
      const { slug, productCode } = request.params
      const { organization } = await request.getMembership(slug)

      const organizationId = organization.id

      await deleteProductService(organizationId, productCode)

      return reply.status(204).send()
    },
  )
}
