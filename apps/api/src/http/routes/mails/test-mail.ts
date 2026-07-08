import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

import { z } from "zod"

import {
  errorResponseSchema,
  successResponseSchema,
} from "@/lib/api-response"

import { mailService } from "@/services/mail/mail.service"

export async function testMail(
  app: FastifyInstance,
) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/mail/test",
      {
        schema: {
          tags: ["Mail"],
          summary: "Enviar e-mail de teste",

          body: z.object({
            to: z.string().email(),
          }),

          response: {
            200: successResponseSchema(
              z.object({
                message: z.string(),
              })
            ),

            400: errorResponseSchema,
            500: errorResponseSchema,
          },
        },
      },

      async (request, reply) => {
        const { to } =
          request.body
        try {
          await mailService.sendInvite({
            to,
            organization:
              "Minerva Tecnologia",
            invitedBy:
              "Francisco Silva",
            role:
              "ADMIN",
            token:
              crypto.randomUUID(),
          })

          return reply
            .status(200)
            .send({
              success: true,
              data: {
                message:
                  "E-mail enviado com sucesso.",
              },

            })
        } catch (error) {
          request.log.error(error)
          return reply
            .status(500)
            .send({
              success: false,
              error: {
                message:
                  error instanceof Error
                  ? error.message
                  : "Erro ao enviar e-mail.",
              },
            })
        }
      }
    )
}