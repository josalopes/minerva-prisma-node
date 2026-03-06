import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { createAddressService } from "@/services/addresses/create-address";
import { newAddressSchema } from "@/http/schemas";
import { AddressType } from "@prisma/client";

export async function createAddress(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .post('/addresses', {
        schema: {
            tags: ['Addresses'],
            summary: 'Insere o endereço de uma entidade',
            body: z.object({
                ownerType: z.enum(["organization", "member"]),
                ownerId: z.string(),
                type: z.string(),
                street: z.string().optional(),
                number: z.string().optional(),
                complement: z.string().optional(),
                district: z.string().optional(),
                city: z.string().optional(),
                state: z.string().optional(),
                zipCode: z.string().optional(),
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                201: z.object({
                    ownerType: z.string(),
                    ownerId: z.string(),
                    street: z.string().nullable(),
                    number: z.string().nullable(),
                    complement: z.string().nullable(),
                    district: z.string().nullable(),
                    city: z.string().nullable(),
                    state: z.string().nullable(),
                    zipCode: z.string().nullable(),
                    country: z.string().nullable(),
                    type: z.string(),
                    organizationId: z.string().nullable(),
                    memberId: z.string().nullable(),
                    customerId: z.string().nullable(),
                })
            }
        },
      }, 
      async (request, reply) => {
        const data = newAddressSchema.parse(request.body);
        
        const address = await createAddressService({
          ...data,
          type: data.type as AddressType,
        });
    
        return reply.status(201).send(address)
      })
}
