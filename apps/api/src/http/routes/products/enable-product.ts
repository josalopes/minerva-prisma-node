import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { projectSchema } from '@saas/auth';
import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { productSchema } from "@saas/auth/src/models/product";
import { enableProductService } from "@/services/products/enable-product";

export async function enableProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put('/organization/:slug/product/:productCode/enable', {
        schema: {
            tags: ['Projects'],
            summary: 'Habilita um produto da organização',
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

        const product = await enableProductService(
            userId, 
            organization, 
            membership,
            productCode
        )

        return reply.status(204).send()
    })
}