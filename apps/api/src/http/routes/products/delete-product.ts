import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { deleteProductService } from "@/services/products/delete-product";

export async function deleteProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .delete('/organization/:slug/product/:productCode', {
        schema: {
            tags: ['Projects'],
            summary: 'Efetua soft-delete em um produto da organização',
            params: z.object({
                slug: z.string(),
                productCode: z.string()
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
        const { slug, productCode } = request.params
        const userId = await request.getCurrentUserid()
        const { membership, organization } = await request.getUserMembership(slug)

        const product = await deleteProductService(
            userId, 
            organization, 
            membership,
            productCode
        )

        return reply.status(204).send()
    })
}