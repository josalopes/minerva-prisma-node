import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { projectSchema } from '@saas/auth';
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { productSchema } from "@saas/auth/src/models/product";
import { enableProductService } from "@/services/products/enable-product";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function enableProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .put('/organization/:slug/product/:productCode/enable', {
        preHandler: [verifyJwt],
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
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getMembership(slug)

        const product = await enableProductService(
            userId, 
            organization, 
            membership,
            productCode
        )

        return reply.status(204).send()
    })
}