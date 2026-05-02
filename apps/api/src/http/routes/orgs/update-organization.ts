import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";
import { apiError } from "@/lib/http-error";

import { errorResponseSchema, successResponseSchema } from "@/lib/api-response";
import { updateOrganizationSchema, organizationEntitySchema } from "@saas/contracts/organization"

export async function updateOrganization(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .patch('/organization/:slug', {
        schema: {
            tags: ['Organizations'],
            summary: 'Atualiza detalhes de uma organização',
            body: updateOrganizationSchema.omit({ slug: true }),
            params: z.object({
                slug: z.string(),
            }),
            response: {
                400: errorResponseSchema,
                401: errorResponseSchema,
                200: successResponseSchema(organizationEntitySchema),                    
            },
        },
      }, 
      async (request, reply) => {
        const { name, domain, shouldAttachUserByDomain } = request.body
        const { slug } = request.params

        const userId = await request.getCurrentUserid()
        const { membership, organization } = await request.getUserMembership(slug)

        if (domain) {
            const organizationByDomain = await prisma.organization.findFirst({
                where: {
                    domain,
                    id: {
                        not: organization.id,
                    },
                },
            })

            if (organizationByDomain) {
                return reply.status(400).send(
                   apiError("Domínio já existe", "DOMAIN_EXISTS")
                )
            }
        }

        const response = await prisma.organization.update({
            where: {
                id: organization.id,
            },
            data: {
                name,
                domain,
                shouldAttachUserByDomain,
            },
        })

        return reply.status(200).send({
            success: true,
            data: response
        })
    })
}

