import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from 'zod'

import { prisma } from "@/lib/prisma";
import { auth } from "@/http/middlewares/auth";

export async function createProject(app: FastifyInstance) {
    app
      .withTypeProvider<ZodTypeProvider>()
      .register(auth)
      .put('/address/entity/:id', {
        schema: {
            tags: ['Adrdresses'],
            summary: 'Atualiza o endereço de uma entidade',
            body: z.object({
                street: z.string().nullable(),
                number: z.string().nullable(),
                district: z.string().nullable(),
                city: z.string().nullable(),
                state: z.string().nullable(),
                postalCode: z.string().nullable(),
            }),
            params: z.object({
                id: z.string()
            }),
            response: {
                400: z.object({
                        message: z.string(),
                    }),
                401: z.object({
                        message: z.string(),
                    }),
                201: z.object({
                        addressId: z.int()
                    })
            }
        },
      }, 
      async (request, reply) => {
        const { id } = request.params
        // const userId = await request.getCurrentUserid()
        
        // const { organization, membership } = await request.getUserMembership(slug)

        // if (!organization) {
        //     return reply.status(400).send({ message: 'Organização inexistente' })
        // }
        
        // const { cannot } = getUserPermissions(userId, membership.role)
        
        // if (cannot('create', 'Project')) {
        //     return reply.status(401).send({ message: 'Você não tem permissão para criar projetos' })
        // }  
      
        const { street, number, district, city, state, postalCode } = request.body

        // const address = await prisma.address.update({
        //     data: {
        //         street,
        //         number,
        //         district,
        //         city,
        //         state,
        //         postalCode,
        //         ownerId: id
        //     },
        // })  

        // return reply.status(201).send({
        //     addressId: address.id,
        // })
      })
}