import { prisma } from '@/lib/prisma'
import { BadRequestError } from '../../http/routes/-errors/bad-request-error'

export async function deleteProductService(
  organizationId: string,
  productCode: string,
) {
  const product = await prisma.product.findFirst({
    where: {
      code: productCode,
      organizationId,
    },
  })

  if (!product) {
    throw new BadRequestError('Produto não encontrado')
  }

  await prisma.product.update({
    where: {
      id: product.id,
    },
    data: {
      deletedAt: new Date(),
    },
  })
}
