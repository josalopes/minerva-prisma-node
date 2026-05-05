import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "../-errors/bad-request-error";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";

export async function updateOrganizationAvatar(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .patch('/organization/:slug/avatar', {
        schema: {
            tags: ['Organizations'],
            summary: 'Atualiza a imagem de avatar da organização',
            body: z.object({
                avatarUrl: z.string().nullable(),
                avatarPublicId: z.string().nullable(),
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
                204: z.null()
            }
        },
      }, 
      async (request, reply) => {
        const { avatarUrl, avatarPublicId } = request.body
        const { slug } = request.params
        const userId = await request.getCurrentUserid()
        const { membership, organization } = await request.getUserMembership(slug)

        const authOrganization = organizationSchema.parse({
            id: organization.id,
            ownerId: organization.ownerId,
        })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authOrganization)) {
            throw new BadRequestError('Você não tem permissão para atualizar esta organização')
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return reply.status(400).send({ message: 'Usuário não encontrado' })
        }

        await prisma.organization.update({
            where: {
                id: organization.id
            },
            data: {
                avatarUrl,
                avatarPublicId
            }
        })

        return reply.status(204).send()
    })
}