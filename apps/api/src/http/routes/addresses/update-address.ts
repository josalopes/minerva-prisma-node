import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { updateAddressSchema } from "@/http/schemas";
import { AddressType } from "@prisma/client";
import { updateAddressService } from "@/services/addresses/update-address";

export async function updateAddress(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put('/address/entity/:id', {
        schema: {
            tags: ['Adrdresses'],
            summary: 'Atualiza o endereço de uma entidade',
            body: z.object({
                type: z.string(),
                street: z.string().optional(),
                number: z.string().optional(),
                complement: z.string().optional(),
                district: z.string().optional(),
                city: z.string().optional(),
                state: z.string().optional(),
                zipCode: z.string().optional(),
            }),
            params: z.object({
                id: z.coerce.number()
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
                        type: z.string(),
                        street: z.string().nullable(),
                        number: z.string().nullable(),
                        complement: z.string().nullable(),
                        district: z.string().nullable(),
                        city: z.string().nullable(),
                        state: z.string().nullable(),
                        zipCode: z.string().nullable(),
                    })
            }
        },
      }, 
      async (request, reply) => {
        const { id } = request.params
        const data = updateAddressSchema.parse(request.body);

        const address = await updateAddressService({
            ...data,
            id,
            type: data.type as AddressType,
        });
    
        return reply.status(201).send(address)
      })
}