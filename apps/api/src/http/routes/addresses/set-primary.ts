import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { successResponseSchema } from "@/lib/api-response";
import { setPrimaryAddressService } from "@/services/addresses/set-primary-address";
import { ownerTypeSchema } from "@saas/contracts";


export async function setPrimary(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .patch('/address/:id/primary', {
        schema: {
          tags: ['Adrdresses'],
          summary: 'Converte o endereço em principal',
          body: z.object({
            ownerId: z.string(),
            ownerType: ownerTypeSchema
          }),
          params: z.object({
            id: z.coerce.number()
          }),
          response: {
            200: successResponseSchema(z.object({}))
          }
        },
      }, 
      async (request, reply) => {
        const { id } = request.params
        const { ownerId, ownerType } = request.body;

        const address = await setPrimaryAddressService(
         { 
          ownerType,
          ownerId,
          addressId: id
        },
        );
    
        return reply.status(200).send({
            success: true,
            data: {}
        })
      })
}