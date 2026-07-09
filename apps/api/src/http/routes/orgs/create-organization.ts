import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'

import { prisma } from '@/lib/prisma'
import { apiError } from '@/lib/http-error'
import { gerarNextVal } from '@/utils/generate-next-sequence'

import { errorResponseSchema, successResponseSchema } from '@/lib/api-response'
import { createOrganizationSchema } from '@saas/contracts/organization/organization.input'
import { organizationEntitySchema } from '@saas/contracts/organization/organization.entity'
import { createOrganizationService } from '@/services/organizations/create-organization'
import { createSlug } from '@/utils/create-slug'
import { verifyJwt } from '@/http/hooks/verify-jwt'

export async function createOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/organization',
    {
      preHandler: [verifyJwt],
      schema: {
        tags: ['Organizations'],
        summary: 'Cria uma nova organização',
        security: [{ bearerAuth: [] }],
        body: createOrganizationSchema,
        response: {
          400: errorResponseSchema,
          201: successResponseSchema(organizationEntitySchema),
        },
      },
    },
    async (request, reply) => {
      const userId = await request.getCurrentUserId()
      const { domain, cpfCnpj } = request.body
      const org = createOrganizationSchema.parse(request.body)

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        return reply
          .status(400)
          .send(apiError('Usuário não encontrado', 'USER_NOT_FOUND'))
      }

      if (domain) {
        const organizationByDomain = await prisma.organization.findUnique({
          where: {
            domain,
          },
        })

        if (organizationByDomain) {
          return reply
            .status(400)
            .send(apiError('Domínio já existe', 'DOMAIN_EXISTS'))
        }
      }

      if (cpfCnpj) {
        const organizationByCnpj = await prisma.organization.findUnique({
          where: {
            cpfCnpj,
          },
        })

        if (organizationByCnpj) {
          return reply
            .status(400)
            .send(apiError('CPF/CNPJ já existe', 'CPF_CNPJ EXISTS'))
        }
      }

      const geradorCodigoEmpresa = await prisma.seedOrganization.findFirst({
        where: {
          id: 1,
        },
      })

      const nextValOrg = geradorCodigoEmpresa?.nextValOrg ?? 100000
      const slug = (
        (await gerarNextVal('seed_org')) + BigInt(nextValOrg)
      ).toString()

      const organization = await createOrganizationService(slug, userId, org)

      return reply.status(201).send({
        success: true,
        data: organization,
      })
    },
  )
}
