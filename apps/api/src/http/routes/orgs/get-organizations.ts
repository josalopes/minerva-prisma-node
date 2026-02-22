import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { roleSchema } from "@saas/auth";
import { getUserOrganizationsService } from "@/services/organizations/get-user-organizations";

export async function getOrganizations(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .get(
            '/organizations', 
            {
                schema: {
                    tags: ['Organizations'],
                    summary: 'Obtém as organizações vinculadas a um usuário',
                    security: [{ bearerAuth: [] }],
                    response: {
                        200: z.object({
                            organizations: z.array(
                                z.object({
                                    id: z.uuid(),
                                    name: z.string().describe('O nome da organização'),
                                    slug: z.string().describe('O nome abreviado da organização'),
                                    avatarUrl: z.url().nullable().describe('O avatar da organização'),
                                    logoUrl: z.url().nullable().describe('O avatar da organização'),
                                    role: roleSchema.describe('O papel dos membros da organização'),
                                    addresses: z.array(
                                        z.object({
                                            id: z.int(),
                                            street: z.string().nullable(),
                                            number: z.string().nullable(),
                                            complement: z.string().nullable(),
                                            district: z.string().nullable(),
                                            city: z.string().nullable(),
                                            state: z.string().nullable(),
                                            zipCode: z.string().nullable(),
                                        })
                                    ),
                                    members: z.array(
                                        z.object({
                                            userId: z.string(),
                                            email: z.string().nullable(),
                                            role: roleSchema,
                                        })
                                    ),
                                }).describe('Detalhes da organização'),
                            ),
                        }).describe('Lista de organizações do usuário'),                
                    },
                }
            }, 
            async (request) => {
                const userId = await request.getCurrentUserid()

                const organizations = await getUserOrganizationsService(userId);

                return { organizations };
            }
        )
    }