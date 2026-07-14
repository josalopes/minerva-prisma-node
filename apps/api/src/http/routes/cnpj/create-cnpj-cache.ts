import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { prisma } from '@/lib/prisma'
import { cnpjSchema } from './cnpj.schema'

export async function createCnpjCache(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/cnpj',
    {
      schema: {
        tags: ['CnpjCache'],
        summary: 'Cria um registro de CNPJ em cache',

        body: cnpjSchema, // 🔥 entrada tipada

        response: {
          201: cnpjSchema,
          400: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const data = request.body

      try {
        const cnpj = data.document.replace(/\D/g, '')

        // 🔥 upsert evita duplicação
        const saved = await prisma.cnpjCache.upsert({
          where: { cnpj },
          update: {
            data,
          },
          create: {
            cnpj,
            data,
          },
        })

        // 🔥 garante tipagem correta na saída
        const parsed = cnpjSchema.parse(saved.data)

        return reply.status(201).send(parsed)
      } catch {
        return reply.status(400).send({
          message: 'Erro ao salvar CNPJ',
        })
      }
    },
  )
}
