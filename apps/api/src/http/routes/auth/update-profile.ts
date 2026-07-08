import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function updateProfile(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .put('/profile/avatar', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Auth'],
            summary: 'Atualiza a imagem de avatar do usuário',
            body: z.object({
                avatarUrl: z.string().optional(),
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
        const { avatarUrl } = request.body

        const userId = await request.getCurrentUserId()
        // const { membership, organization } = await request.getUserMembership(slug)
        
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return reply.status(400).send({ message: 'Usuário não encontrado' })
        }

        // const productId = product.id
        
        // const authProduct = productSchema.parse(product)

        // const { cannot } = getUserPermissions(userId, membership.role)

        // if (cannot('update', authProduct)) {
        //     return reply.status(401).send({ message: 'Você não tem permissão para atualizar produtos' })
        // }

        

        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                avatarUrl,
            }
        })

        return reply.status(204).send()
    })
}