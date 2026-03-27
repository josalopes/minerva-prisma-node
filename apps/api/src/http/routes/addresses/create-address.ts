import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

import { createAddressService } from "@/services/addresses/create-address";
import { AddressType } from "@prisma/client";

import { errorResponseSchema, successResponseSchema } from "@/lib/api-response";
import { addressEntitySchema } from './../../../../../../packages/contracts/address/address.entity';
import { createAddressSchema     
  } from "../../../../../../packages/contracts/address/address.input"

export async function createAddress(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .post('/addresses', {
        schema: {
            tags: ['Addresses'],
            summary: 'Insere o endereço de uma entidade',
            body: createAddressSchema,
            response: {
              400: errorResponseSchema,
              401: errorResponseSchema,
              201: successResponseSchema(addressEntitySchema)
            }
        },
      }, 
      async (request, reply) => {
        const addr = createAddressSchema.parse(request.body);
        console.log('body', request.body)
        console.log('addr', addr)
        
        const address = await createAddressService({
          ...addr,
          type: addr.type as AddressType,
        }) as any;
    
        return reply.status(201).send({
            success: true,
            data: address
        })
      })

   
}
