import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { compare, hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function changePassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().patch(
    '/account/password',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Account'],
        summary: 'Alterar senha',

        body: z.object({
          currentPassword: z.string(),
          newPassword: z.string().min(6),
        }),

        response: {
          200: z.object({
            success: z.literal(true),
          }),

          400: z.object({
            message: z.string(),
          }),

          401: z.object({
            message: z.string(),
          }),
        },
      },
    },

    async (request, reply) => {
      const userId = await request.getCurrentUserId()

      const { currentPassword, newPassword } = request.body

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        return reply.status(401).send({
          message: 'Usuário não encontrado',
        })
      }

      const passwordMatches = await compare(currentPassword, user.passwordHash)

      if (!passwordMatches) {
        return reply.status(400).send({
          message: 'Senha atual inválida',
        })
      }

      const hashedPassword = await hash(newPassword, 8)

      await prisma.user.update({
        where: {
          id: userId,
        },

        data: {
          passwordHash: hashedPassword,

          passwordChangedAt: new Date(),
        },
      })

      return reply.status(200).send({
        success: true,
      })
    },
  )
}
