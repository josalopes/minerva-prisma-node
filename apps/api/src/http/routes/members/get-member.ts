import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { roleSchema } from '@saas/auth'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function getMember(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/member',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Member'],
        summary: 'Obtém os dados de membro do usuário autenticado',
        response: {
          400: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
          200: z.object({
            member: z
              .object({
                id: z.uuid(),
                role: roleSchema,
                organizationId: z.string(),
                // name: z.string(),
                slug: z.string(),
              })
              .nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const member = await prisma.member.findFirst({
        select: {
          id: true,
          role: true,
          organizationId: true,
          organization: {
            select: {
              slug: true,
            },
          },
        },
        where: {
          userId,
        },
      })

      return reply.send({
        member: member
          ? {
              id: member.id,
              role: member.role,
              organizationId: member.organizationId,
              slug: member.organization.slug,
            }
          : null,
      })
    },
  )
}
