import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { getAddressesService } from "@/services/addresses/get-addresses";

export async function getAddresses(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .get('/addresses', {
        schema: {
            tags: ['Addresses'],
            summary: 'Obtém os endereços de uma entidade',
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                200: z.array(z.object({
                    id: z.number(),
                    createdAt: z.date(),
                    updatedAt: z.date(),
                    ownerType: z.string(),
                    ownerId: z.string(),
                    type: z.string(),
                    street: z.string().nullable(),
                    number: z.string().nullable(),
                    complement: z.string().nullable(),
                    district: z.string().nullable(),
                    city: z.string().nullable(),
                    state: z.string().nullable(),
                    zipCode: z.string().nullable(),
                    organizationId: z.string().nullable(),
                    memberId: z.string().nullable(),
                    customerId: z.string().nullable(),
                }))
            }
        },
      }, 
      async (request, reply) => {
        const querySchema = z.object({
          ownerType: z.enum(["organization", "member"]),
          ownerId: z.string(),
        });

        const { ownerType, ownerId } = querySchema.parse(request.query);

        const addresses = await getAddressesService(ownerType, ownerId);

        return reply.status(200).send(addresses);
      })
}