import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { BadRequestError } from "../-errors/bad-request-error";
import { roleSchema } from "@saas/auth"
import { verifyJwt } from "@/http/hooks/verify-jwt";

export async function getMembership(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .get(
            '/organization/:slug/membership', 
            {
        preHandler: [verifyJwt],
                schema: {
                    tags: ['Organizations'],
                    summary: 'Obtém os detalhes da associação do usuário na organização',
                    security: [{ bearerAuth: [] }],
                    params: z.object({
                        slug: z.string(),
                    }),
                    response: {
                        400: z.object({
                            message: z.string(),
                            }),
                        200: z.object({
                            membership: z.object({
                                id: z.uuid(),
                                role: roleSchema.describe('O papel do usuário na organização'),
                                userId: z.uuid(),
                                organizationId: z.uuid().describe('O ID da organização'),
                            })
                        }).describe('Detalhes da associação do usuário na organização'),
                    },                
                },
            }, 
            async (request, reply) => {
                const { slug } = request.params
                const { membership } = await request.getMembership(slug)

                if (!membership) {
                    throw new BadRequestError('Você não é membro dessa organização')
                }

                const member = {
                    id: membership.id,
                    role: membership.role,
                    UserId: membership.userId,
                    organization: membership.organizationId
                }

                return reply.status(200).send(
                { 
                    membership: {
                        id: membership.id, 
                        role: membership.role, 
                        userId: membership.userId,
                        organizationId: membership.organizationId, 
                    }
                })
            }
        )
    }