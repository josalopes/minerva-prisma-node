import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { hash } from 'bcryptjs'

import { prisma } from '@/lib/prisma'
import { gerarNextVal } from '@/utils/generate-next-sequence'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function acceptInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/invite/:token',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Invites'],
        summary: 'Aceitar convite de uma organização',
        params: z.object({
          token: z.string(),
        }),
        response: {
          400: z.object({
            message: z.string(),
          }),
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { token } = request.params

      const geradorLoginUsuario = await prisma.seedUserLogin.findFirst({
        where: {
          id: 1,
        },
      })

      const nextValUserLogin = geradorLoginUsuario?.nextValLogin ?? 10000

      const invite = await prisma.invite.findUnique({
        where: {
          token,
          // id: inviteId
        },
      })

      if (!invite) {
        return reply
          .status(400)
          .send({ message: 'Convite inexistente ou expirado' })
      }

      // const user = await prisma.user.findUnique({
      //   where: {
      //     id: userId,
      //   },
      // })

      // if (!user) {
      //   return reply.status(400).send({ message: 'Usuário não encontrado' })
      // }

      // if (user.email !== invite.email) {
      //   return reply.status(400).send({ message: 'Este convite pertence a outro usuário' })
      // }

      const code = (
        (await gerarNextVal('seed_login')) + BigInt(nextValUserLogin)
      ).toString()

      const user = await prisma.user.create({
        data: {
          email: invite.email,
          passwordChangedAt: null,
          mustChangePassword: true,
          login: code,
          passwordHash: await hash(code, 1),
        },
      })

      await prisma.$transaction([
        prisma.member.create({
          data: {
            userId: user.id,
            organizationId: invite.organizationId,
            role: invite.role,
          },
        }),

        prisma.invite.delete({
          where: {
            token,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )
}
