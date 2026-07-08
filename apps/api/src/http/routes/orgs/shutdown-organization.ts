import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { organizationSchema } from '@saas/auth';
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../-errors/bad-request-error";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function shutdownOrganization(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .delete('/organization/:slug', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Organizations'],
            summary: 'Desativa uma organização',
            params: z.object({
                slug: z.string()
            }),
            response: {
                401: z.object({
                        message: z.string(),
                    }),
                204: z.null()
            }
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getMembership(slug)

        const authOrganization = organizationSchema.parse({
            id: organization.id,
            ownerId: organization.ownerId,
        })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authOrganization)) {
            throw new BadRequestError('Você não tem permissão para desativar essa organização')
        }


        await prisma.organization.delete({
            where: {
                id: organization.id,
            }
        })

        return reply.status(204).send()
    })
}