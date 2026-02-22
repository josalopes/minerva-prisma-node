import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { productUnitSchema } from "@/http/schemas";
import { getProductsService } from "@/services/products/get-products";

export async function getProducts(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get('/organization/:slug/products', {
        schema: {
            tags: ['Products'],
            summary: 'Obtém todos os produtos da organização',
            params: z.object({
                slug: z.string(),
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                200: z.object({
                    products: z.array(
                        z.object({
                            id: z.string(),
                            name: z.string(),
                            code: z.string(),
                            price: z.int(),
                            organizationId: z.uuid(),
                            measureUnit: productUnitSchema,
                        }),
                    ),
                }),
            },
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserid()
        const { organization, membership } = await request.getUserMembership(slug)

        const products = await getProductsService(
            userId, 
            organization, 
            membership,
        )

        return reply.send({ products })
      })
}