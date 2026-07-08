import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { roleSchema } from "@saas/auth";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function updateMember(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .put('/organization/:slug/member/:memberId', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Members'],
            summary: 'Atualiza o papel de membro da organização',
            params: z.object({
                slug: z.string(),
                memberId: z.uuid(),
            }),
            body: z.object({
                role: roleSchema
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                204: z.null(),
            },
        },
      }, 
      async (request, reply) => {
        const { slug, memberId } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } = await request.getMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        
        if (cannot('update', 'User')) {
            return reply.status(401).send({ message: 'Você não tem permissão para atualizar membros' })
        } 

        if (!organization) {
            return reply.status(400).send({ message: 'Organização inexistente' })
        }

        const {role } = request.body

        await prisma.member.update({
            where: {
                id: memberId,
                organizationId: organization.id
            },
            data: {
                role
            }
        })

        return reply.status(204).send()
      })
}