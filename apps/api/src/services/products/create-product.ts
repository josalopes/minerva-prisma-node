import { prisma } from '@/lib/prisma'
import { ProductUnit } from '@prisma/client'
import { BadRequestError } from '../../http/routes/-errors/bad-request-error'
import { toCents } from '@/utils/money'
interface Product {
  name: string
  code: string
  price: number
  measureUnit: ProductUnit
}

export async function createProductService(
  slug: string,
  userId: string,
  organizationId: string,
  item: Product,
) {
  const { name, code, price, measureUnit } = item

  if (name.length === 0) {
    throw new BadRequestError('O nome do produto não foi informado.')
  }

  if (code.length === 0) {
    throw new BadRequestError('O código do produto não foi informado.')
  }

  if (code) {
    const productByCodej = await prisma.product.findFirst({
      where: {
        code,
        organizationId,
      },
    })

    if (productByCodej) {
      throw new BadRequestError(
        'Já existe um produto com este código nesta organização.',
      )
    }
  }

  const product = await prisma.product.create({
    data: {
      name,
      code,
      price: toCents(price),
      organizationId,
      measureUnit,
    },
  })

  return { product }
}
