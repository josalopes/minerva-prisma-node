import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

import { cnpjSchema } from "./cnpj.schema"
import { getCnpjData } from "./cnpj.service"

export async function getCnpjCache(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      "/cnpj/:cnpj",
      {
        schema: {
          tags: ["CnpjCache"],
          summary: "Obtém CNPJ consultados em api externa",
          params: z.object({
            cnpj: z.string().min(14).max(14)
          }),
          response: {
            400: z.object({
              message: z.string(),
            }),
            500: z.object({
              message: z.string(),
            }),
            200: cnpjSchema, // 🔥 agora tipado corretamente
          },
        },
      },
      async (request, reply) => {
        const { cnpj } = request.params

        try {
          const data = await getCnpjData(cnpj)

          return reply.status(200).send(data)

        } catch (err: any) {
          console.error("Erro real no endpoint /cnpj:", err)

          return reply.status(500).send({
            message: err?.message || "Erro ao consultar CNPJ",
          })
        }
      }
    )
}
