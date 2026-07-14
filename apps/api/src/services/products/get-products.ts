import { prisma } from '@/lib/prisma'
import { fromCents } from '@/utils/money'

export async function getProductsService(organizationId: string) {
  const productsRaw = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      price: true,
      organizationId: true,
      measureUnit: true,
    },
    where: {
      organizationId,
      deletedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  const products = productsRaw.map((product) => ({
    ...product,
    price: fromCents(product.price),
  }))

  return products
}
