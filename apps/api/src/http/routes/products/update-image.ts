import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

// import { productSchema } from '@saas/auth';
import { productSchema } from '@saas/auth/src/models/product';
import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { productUnitSchema } from "@/http/schemas";

export async function updateProduct(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put('/organization/:slug/product/:id/image', {
        schema: {
            tags: ['Products'],
            summary: 'Atualiza a imagem de um produto da organização',
            body: z.object({
                imageUrl: z.string(),
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
        const { membership, organization } = await request.getUserMembership(slug)
        
        const { imageUrl } = request.body
        
        const product = await prisma.product.findFirst({
            where: {
                id
            }
        })

        if (!product) {
            return reply.status(400).send({ message: 'Produto não encontrado' })
        }

        // const productId = product.id
        
        const authProduct = productSchema.parse(product)

        const { cannot } = getUserPermissions(userId, membership.role)

        // if (cannot('update', authProduct)) {
        //     return reply.status(401).send({ message: 'Você não tem permissão para atualizar produtos' })
        // }

        

        await prisma.product.update({
            where: {
                id
            },
            data: {
                imageUrl,
            }
        })

        return reply.status(204).send()
    })
}