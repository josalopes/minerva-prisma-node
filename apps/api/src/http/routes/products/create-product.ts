import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { productUnitSchema } from '../../schemas'
import { createProductService } from '@/services/products/create-product'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { BadRequestError } from '../-errors/bad-request-error'
import { getUserPermissions } from '@/utils/get-user-permissions'

export async function createProduct(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organization/:slug/product',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Products'],
        summary: 'Cria um novo produto dentro da organização',
        body: z.object({
          name: z.string(),
          code: z.string(),
          price: z.number(),
          measureUnit: productUnitSchema,
        }),
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
          201: z.object({
            productId: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const { name, code, price, measureUnit } = request.body
      const userId = await request.getCurrentUserId()
      const { organization, membership } = await request.getMembership(slug)

      if (!organization) {
        throw new BadRequestError('Organização inexistente')
      }

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('create', 'Project')) {
        throw new BadRequestError('Você não tem permissão para criar projetos')
      }

      const organizationId = organization.id

      const product = await createProductService(slug, userId, organizationId, {
        name,
        code,
        price,
        measureUnit,
      })

      return reply.status(201).send({
        productId: product.product.id,
      })
    },
  )
}
