import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { productUnitSchema } from '@/http/schemas'
import { getProductsService } from '@/services/products/get-products'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { BadRequestError } from '../-errors/bad-request-error'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function getProducts(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organization/:slug/products',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Products'],
        summary: 'Obtém todos os produtos da organização',
        params: z.object({
          slug: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          200: z.object({
            products: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                code: z.string(),
                price: z.number(),
                organizationId: z.uuid(),
                measureUnit: productUnitSchema,
              }),
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()
      const { organization, membership } = await request.getMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Project')) {
        throw new BadRequestError(
          'Você não tem permissão para visualizar produtos',
        )
      }

      if (!organization) {
        throw new BadRequestError('Organização inexistente')
      }
      const organizationId = organization.id

      const products = await getProductsService(organizationId)

      return reply.send({ products })
    },
  )
}
