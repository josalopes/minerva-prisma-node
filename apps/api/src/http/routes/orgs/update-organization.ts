import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/http-error'

import { errorResponseSchema, successResponseSchema } from '@/lib/api-response'
import {
  updateOrganizationSchema,
  organizationEntitySchema,
} from '@saas/contracts/organization'
import { updateOrganizationService } from '@/services/organizations/update-organization'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function updateOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/organization/:slug',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        summary: 'Atualiza detalhes de uma organização',
        body: updateOrganizationSchema.omit({ slug: true }),
        params: z.object({
          slug: z.string(),
        }),
        response: {
          400: errorResponseSchema,
          401: errorResponseSchema,
          200: successResponseSchema(organizationEntitySchema),
        },
      },
    },
    async (request, reply) => {
      const { name, domain, shouldAttachUserByDomain } = request.body
      const { slug } = request.params

      const userId = await request.getCurrentUserId()
      const { organization } = await request.getMembership(slug)

      if (domain) {
        const organizationByDomain = await prisma.organization.findFirst({
          where: {
            domain,
            id: {
              not: organization.id,
            },
          },
        })

        if (organizationByDomain) {
          return reply
            .status(400)
            .send(apiError('Domínio já existe', 'DOMAIN_EXISTS'))
        }
      }

      const response = await updateOrganizationService(
        organization.id,
        userId,
        {
          name,
          domain,
          shouldAttachUserByDomain,
        },
      )

      return reply.status(200).send({
        success: true,
        data: response,
      })
    },
  )
}
