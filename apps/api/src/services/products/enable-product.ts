import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../../http/routes/-errors/bad-request-error'

export async function enableProductService(
  organizationId: string,
  productCode: string,
) {
  const product = await prisma.product.findFirst({
    where: {
      code: productCode,
      organizationId: organizationId,
    },
  })

  if (!product) {
    throw new BadRequestError('Produto não encontrado')
  }

  const productId = product.id

  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      deletedAt: null,
    },
  })
}
