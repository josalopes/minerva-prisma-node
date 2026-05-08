import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

// import { productSchema } from '@saas/auth';
import { auth } from "@/http/middlewares/auth";
import { updateStockService } from "@/services/products/update-stock";

export async function updateProductStock(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .patch('/organization/:slug/productId/:id/stock', {
        schema: {
            tags: ['Products'],
            summary: 'Atualiza o estoque de um produto da organização',
            body: z.object({
                stock: z.int(),
            }),
            params: z.object({
                slug: z.string(),
                id: z.string()
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
        const { slug, id } = request.params

        const userId = await request.getCurrentUserid()
        const { membership } = await request.getUserMembership(slug)
        
        const { stock } = request.body

        const product = await updateStockService(
            userId,
            id, 
            membership,
            { stock }
        )
        
        return reply.status(204).send()
    })
}