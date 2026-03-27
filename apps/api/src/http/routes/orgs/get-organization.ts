import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { BadRequestError } from "../-errors/bad-request-error";
import { errorResponseSchema, successResponseSchema } from "@/lib/api-response";

export async function getOrganization(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
            '/organization/:slug', 
            {
                schema: {
                    tags: ['Organizations'],
                    summary: 'Obtém os detalhes de uma organização',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        400: errorResponseSchema,
                        200: successResponseSchema(
                            z.object({
                                organization: z.object({
                                    id: z.uuid(),
                                    name: z.string(),
                                    slug: z.string(),
                                    domain: z.string().nullable(),
                                    personType: z.string(),
                                    shouldAttachUserByDomain: z.boolean(),
                                    avatarUrl: z.url().nullable(),
                                    logoUrl: z.url().nullable(),
                                    createdAt: z.date(),
                                    updatedAt: z.date().nullable(),
                                    deletedAt: z.date().nullable(),
                                    ownerId: z.uuid().nullable(),
                                    addresses: z.array(
                                        z.object({
                                            id: z.int(),
                                            street: z.string().nullable(),
                                            number: z.string().nullable(),
                                            district: z.string().nullable(),
                                            city: z.string().nullable(),
                                            state: z.string().nullable(),
                                            zipCode: z.string().nullable(),
                                        })
                                    ),
                                }),
                            })
                        )
                    },                
                },
            }, 
            async (request, reply) => {
                const { slug } = request.params
                const organization = await prisma.organization.findUnique({
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    domain: true,
                    personType: true,
                    shouldAttachUserByDomain: true,
                    avatarUrl: true,
                    logoUrl: true,
                    createdAt: true,
                    updatedAt: true,
                    deletedAt: true,
                    ownerId: true,
                    addresses: {
                        select: {
                            id: true,
                            street: true,
                            number: true,
                            district: true,
                            city: true,
                            state: true,
                            zipCode: true,
                        },
                    },
                  }, 
                    where: { slug },
                })

                if (!organization) {
                    throw new BadRequestError('Organização não encontrada')
                }

                return reply.status(200).send({
                    success: true,
                    data: {
                        organization
                    }
                })
            }
        )
    }