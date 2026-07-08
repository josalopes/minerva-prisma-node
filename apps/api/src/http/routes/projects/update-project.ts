import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { projectSchema } from '@saas/auth';
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function updateProject(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .put('/organization/:slug/project/:projectId', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Projects'],
            summary: 'Atualiza dados de projeto de uma organização',
            body: z.object({
                name: z.string(),
                description: z.string(),
            }),
            params: z.object({
                slug: z.string(),
                projectId: z.uuid()
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
        const { slug, projectId } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } = await request.getMembership(slug)

        const project = await prisma.project.findUnique({
            where: {
                id: projectId,
                organizationId: organization.id
            }
        })

        if (!project) {
            return reply.status(400).send({ message: 'Projeto não encontrado' })
        }
        
        const authProject = projectSchema.parse(project)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authProject)) {
            return reply.status(401).send({ message: 'Você não tem permissão para atualizar projetos' })
        }

        const { name, description } = request.body

        await prisma.project.update({
            where: {
                id: projectId,
            },
            data: {
                name,
                description
            }
        })

        return reply.status(204).send()
    })
}