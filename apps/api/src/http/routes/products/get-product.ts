import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { productUnitSchema } from "@/http/schemas";
import { getProductService } from "@/services/products/get-product";

export async function getProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get('/organization/:slug/product/:productCode', {
        schema: {
            tags: ['Products'],
            summary: 'Obtém os detalhes de um produto da organização',
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
                200: z.object({
                        product: z.object({
                            id: z.string(),
                            name: z.string(),
                            code: z.string(),
                            price: z.int(),
                            organizationId: z.uuid(),
                            measureUnit: productUnitSchema,
                        })
                    }),
                },
            },
      }, 
      async (request, reply) => {
        const { slug, productCode} = request.params
        const userId = await request.getCurrentUserid()
        const { organization, membership } = await request.getUserMembership(slug)

        const product = await getProductService(
            userId, 
            organization.id, 
            membership,
            productCode
        )

        return reply.send({ product })
      })
}