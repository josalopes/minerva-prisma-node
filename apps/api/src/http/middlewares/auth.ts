import type { FastifyInstance } from "fastify"
import { fastifyPlugin } from "fastify-plugin"

import { prisma } from "@/lib/prisma"

import { UnauthorizedError } from "../routes/-errors/unauthorized-error"
import { BadRequestError } from "../routes/-errors/bad-request-error"

export const auth = fastifyPlugin(async (app: FastifyInstance) => {
  app.decorateRequest("currentUserId", null)

  app.decorateRequest(
    "getCurrentUserId",
    async function () {

      if (this.currentUserId) {
        return this.currentUserId
      }

      try {
        const { sub } =
          await this.jwtVerify<{ sub: string }>()

        this.currentUserId = sub

        return sub

      } catch {

        throw new UnauthorizedError(
          "Token de autenticação inválido"
        )
      }
    },
  )

  app.decorateRequest(
    "getMembership",
    async function (slug: string) {

      const userId =
        await this.getCurrentUserId()

      const member =
        await prisma.member.findFirst({

          where: {
            userId,
            organization: {
              slug,
            },
          },

          include: {
            organization: true,
          },

        })

      if (!member) {
        throw new BadRequestError(
          "Você não é membro desta organização"
        )
      }

      const { organization, ...membership } =
        member

      return {
        organization,
        membership,
      }
    },
  )
})
