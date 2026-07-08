import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { updateAddressService } from "@/services/addresses/update-address";
import { addressEntitySchema, updateAddressSchema } from '@saas/contracts';
import { errorResponseSchema, successResponseSchema } from "@/lib/api-response";
import { verifyJwt } from "@/http/hooks/verify-jwt";


export async function updateAddress(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .patch('/org/:slug/address/:id', {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Adrdresses'],
        summary: 'Atualiza o endereço de uma entidade',
        body: updateAddressSchema,
        params: z.object({
          id: z.coerce.number(),
          slug: z.string(),
        }),
        response: {
          400: errorResponseSchema,
          401: errorResponseSchema,
          201: successResponseSchema(addressEntitySchema)
        }
      },
    }, 
    async (request, reply) => {
      const { id, slug } = request.params
      
      const newAddress = request.body

      const userId = await request.getCurrentUserId()

      const address = await updateAddressService(
        newAddress,
        id,
        slug,
        userId,
      )
  
      return reply.status(201).send({
        success: true,
        data: address
      })
    })
}