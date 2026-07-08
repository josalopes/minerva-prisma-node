import type { FastifyInstance } from "fastify"
import z from "zod"
import { ZodTypeProvider } from "fastify-type-provider-zod"

import {
  createTransactionSchema 
} from "@saas/contracts/transaction/create-transaction-schema"
import {
  transactionResponseSchema
} from "@saas/contracts/transaction/transaction"

import { createTransactionService } from "@/services/transactions/create-transaction"
import { successResponseSchema } from "@/lib/api-response"
import { fromCents } from "@/utils/money"
import { verifyJwt } from "@/http/hooks/verify-jwt"

export async function createTransaction(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      "/organization/:slug/transaction",
      {
        preHandler: [verifyJwt],
        schema: {
          tags: ["Transactions"],
          summary: "Cria uma transação com itens",

          params: z.object({
            slug: z.string()
          }),

          body: createTransactionSchema,

          response: {
            201: successResponseSchema(transactionResponseSchema)
          }
        }
      },

      async (request, reply) => {

        const { slug } = request.params
        const userId = await request.getCurrentUserId()

        const { organization } =
          await request.getMembership(slug)

        const transaction = await createTransactionService(
          request.body,
          {
            organizationId: organization.id,
            userId
          }
        )

        return reply.status(201).send({
          success: true,
          data: {
            id: transaction.id,
            totalValue: transaction.totalValue,
            date: transaction.date.toISOString(),

            transactionItems: transaction.transactionItems.map(item => ({
              productId: item.productId,
              productName: item.product.name,
              weight: item.quantity,
              unitPrice: fromCents(item.value)
            }))
          }
        })
      }
    )
}