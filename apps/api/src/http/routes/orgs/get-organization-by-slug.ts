import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "../-errors/bad-request-error";

export async function getOrganizationBySlug(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
            '/organization/slug/:slug', 
            {
                schema: {
                    tags: ['Organizations'],
                    summary: 'Obtém os detalhes de uma organização',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        400: z.object({
                            message: z.string(),
                            }),
                        200: z.object({
                            organization: z.object({
                                id: z.uuid(),
                                name: z.string(),
                                slug: z.string(),
                                avatarUrl: z.url().nullable(),
                                logoUrl: z.url().nullable(),
                            }),
                        })
                    },                
                },
            }, 
            async (request, reply) => {
                const { slug } = request.params
                const org = await prisma.organization.findUnique({
                  where: { slug },
                })

                if (!org) {
                    throw new BadRequestError('Organização não encontrada')
                }

                const organization = {
                    id: org.id,
                    name: org?.name,
                    slug: org.slug,
                    avatarUrl: org.avatarUrl,
                    logoUrl: org.logoUrl,
                }

                return reply.status(200).send(
                    {organization}
                )
            }
        )
    }