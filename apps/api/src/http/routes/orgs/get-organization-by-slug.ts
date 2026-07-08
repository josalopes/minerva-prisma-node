import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../-errors/bad-request-error'
import { verifyJwt } from '@/http/hooks/verify-jwt'
import { getOrganizationBySlugResponseSchema } from '@saas/contracts/organization'

export async function getOrganizationBySlug(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/organization/slug/:slug',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        summary: 'Obtém os detalhes de uma organização',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          200: getOrganizationBySlugResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params

      const organization = await prisma.organization.findUnique({
        where: {
          slug,
        },
        select: {
          id: true,
          slug: true,
          name: true,
          cpfCnpj: true,
          domain: true,
          personType: true,
          shouldAttachUserByDomain: true,
          avatarUrl: true,
          avatarPublicId: true,
          logoUrl: true,
          logoPublicId: true,
        },
      })

      if (!organization) {
        throw new BadRequestError('Organização não encontrada')
      }

      return reply.send({
        organization,
      })
    },
  )
}
