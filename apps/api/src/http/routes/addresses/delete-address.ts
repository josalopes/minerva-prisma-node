import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { deleteAddressService } from "@/services/addresses/delete-address";

export async function deleteAddress(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .delete('/address/:id', {
      }, 
      async (request, reply) => {
        const paramsSchema = z.object({
            id: z.coerce.number(),
        });
    
        const { id } = paramsSchema.parse(request.params);
        
        await deleteAddressService(id);
        
        return { success: true };
      })
}