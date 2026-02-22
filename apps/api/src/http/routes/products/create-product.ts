import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { productUnitSchema } from "../../schemas";
import { createProductService } from "@/services/products/create-product";

export async function createProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .post('/organization/:slug/product', {
        schema: {
            tags: ['Products'],
            summary: 'Cria um novo produto dentro da organização',
            body: z.object({
                name: z.string(),
                code: z.string(),
                price: z.int(),
                measureUnit: productUnitSchema
            }),
            params: z.object({
                slug: z.string()
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                201: z.object({
                        productId: z.string()
                    })
            }
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const { name, code, price, measureUnit } = request.body
        const userId = await request.getCurrentUserid()
        
        const { organization, membership } = await request.getUserMembership(slug)

        const product = await createProductService(
            slug, 
            userId, 
            organization, 
            membership,
            { name, code, price, measureUnit }
        )

        return reply.status(201).send({
            productId: product.product.id,
        })
    })
}