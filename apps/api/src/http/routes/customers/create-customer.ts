import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { auth } from "@/http/middlewares/auth";
import { createCustomerSchema, customerEntitySchema } from '@saas/contracts/customer';
import { errorResponseSchema, successResponseSchema } from '@/lib/api-response';
import { createCustomerService } from "@/services/customers/create-customer";

export async function createCustomer(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .post('/organization/:slug/customer', {
        schema: {
            tags: ['Customers'],
            summary: 'Cria um novo cliente dentro da organização',
            body: createCustomerSchema,
            params: z.object({
                slug: z.string()
            }),
            response: {
                400: errorResponseSchema,
                401: errorResponseSchema,
                201: successResponseSchema(customerEntitySchema)
            }
        },
      }, 
      async (request, reply) => {
        const { slug } = request.params
        const { name, code, cpfCnpj } = request.body
        const userId = await request.getCurrentUserid()
        
        const { organization, membership } = await request.getUserMembership(slug)

        const customer = await createCustomerService(
            {
              name, 
              code, 
              organizationId: organization.id, 
              cpfCnpj,

            }
        )

        return reply.status(201).send({
            success: true,
            data: customer
        })
    })
}