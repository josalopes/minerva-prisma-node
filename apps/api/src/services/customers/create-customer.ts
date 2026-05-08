import { prisma } from '@/lib/prisma'

interface CreateCustomerRequest {
  name: string
  code: string
  cpfCnpj: string | null | undefined
  organizationId: string
}

interface CreateCustomerResponse {
  id: string
  name: string
  code: string
  cpfCnpj: string | null | undefined
  organizationId: string
}

export async function createCustomerService(data: CreateCustomerRequest): Promise<CreateCustomerResponse> {
  const customer = await prisma.customer.create({
    data: {
      name: data.name,
      cpfCnpj: data.cpfCnpj,
      code: data.code,
      organizationId: data.organizationId,
    },
  })

  return customer
}