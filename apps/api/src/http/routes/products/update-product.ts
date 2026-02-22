import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

// import { productSchema } from '@saas/auth';
import { auth } from "@/http/middlewares/auth";
import { productUnitSchema } from "@/http/schemas";
import { updateProductService } from "@/services/products/update-product";

export async function updateProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put('/organization/:slug/product/:productCode', {
        schema: {
            tags: ['Products'],
            summary: 'Atualiza dados de um produto da organização',
            body: z.object({
                name: z.string(),
                code: z.string(),
                price: z.int(),
                measureUnit: productUnitSchema,
            }),
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
        
        const { name, code, price, measureUnit } = request.body

        const product = await updateProductService(
            userId,
            productCode, 
            organization, 
            membership,
            { name, code, price, measureUnit }
        )
        
        return reply.status(204).send()
    })
}