import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { updateAddressSchema } from "@/http/schemas";
import { AddressType } from "@prisma/client";
import { updateAddressService } from "@/services/addresses/update-address";
import { addressEntitySchema } from './../../../../../../packages/contracts/address/address.entity';
import { errorResponseSchema, successResponseSchema } from "@/lib/api-response";


export async function updateAddress(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .patch('/address/entity/:id', {
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
                isPrimary: z.coerce.boolean().default(false),
            }),
            params: z.object({
                id: z.coerce.number()
            }),
            response: {
                400: errorResponseSchema,
                401: errorResponseSchema,
                201: successResponseSchema(addressEntitySchema)
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
        }) as any;
    
        return reply.status(201).send({
            success: true,
            data: address
        })
      })
}