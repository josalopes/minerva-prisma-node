import type { FastifyInstance } from "fastify"
import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"

import { auth } from "@/http/middlewares/auth"
import {
  createTransactionSchema,
  transactionResponseSchema
} from "@saas/contracts/transaction/create-transaction-schema"

import { createTransactionService } from "@/services/transactions/create-transaction-service"

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      "/organization/:slug/transaction",
      {
        schema: {
          tags: ["Transactions"],
          summary: "Cria uma transação com itens",

          params: z.object({
            slug: z.string()
          }) , //createParamsSchema(),

          body: createTransactionSchema,

          response: {
            201: z.object({
              success: z.literal(true),
              data: transactionResponseSchema
            })
          }
        }
      },

      async (request, reply) => {

        const { slug } = request.params
        const userId = await request.getCurrentUserid()

        const { organization } =
          await request.getUserMembership(slug)

        const transaction = await createTransactionService(
          request.body,
          {
            organizationId: organization.id,
            userId
          }
        )

        return reply.status(201).send({
          success: true,
          data: transaction
        })
      }
    )
}