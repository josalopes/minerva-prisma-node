import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { deleteProductService } from "@/services/products/delete-product";
import { cancelTransactionService } from "@/services/transactions/create-transaction";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function cancelTransaction(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .patch('/organization/:slug/transaction/:transactionId', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Transactions'],
            summary: 'Cancela uma transação',
            params: z.object({
                slug: z.string(),
                transactionId: z.string()
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                204: z.null()
            }
        },
      }, 
      async (request, reply) => {
        const { slug, transactionId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getMembership(slug)

        const product = await cancelTransactionService(
            transactionId, 
        )

        return reply.status(204).send()
    })
}