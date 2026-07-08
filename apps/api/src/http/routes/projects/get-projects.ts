import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function getProjects(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/organization/:slug/projects', {
        preHandler: [verifyJwt],
        schema: {
            tags: ['Projects'],
            summary: 'Obtém todos os projetos dentro de uma organização',
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
                    projects: z.array(
                            z.object({
                                id: z.uuid(),
                                description: z.string().nullable(),
                                name: z.string(),
                                slug: z.string(),
                                avatarUrl: z.string().nullable(),
                                organizationId: z.uuid(),
                                ownerId: z.uuid(),
                                createdAt: z.date(),
                                owner: z.object({
                                    id: z.uuid(),
                                    name: z.string().nullable(),
                                    avatarUrl: z.string().nullable(),
                                }),
                            }),
                    ),
                }),
            },
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { organization, membership } = await request.getMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        
        if (cannot('get', 'Project')) {
            return reply.status(401).send({ message: 'Você não tem permissão para visualizar projetos' })
        } 

        if (!organization) {
            return reply.status(400).send({ message: 'Organização inexistente' })
        }

        const projects = await prisma.project.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                slug: true,
                ownerId: true,
                organizationId: true,
                avatarUrl: true,
                createdAt: true,
                owner: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    }
                },
            },
            where: {
                organizationId: organization.id
            },
            orderBy: {
                createdAt: 'desc',
            }
        })

        return reply.send({ projects })
      })
}