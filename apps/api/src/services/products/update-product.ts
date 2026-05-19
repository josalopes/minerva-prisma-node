import { prisma } from "@/lib/prisma";
import { ProductUnit, Role } from "@prisma/client";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../../http/routes/-errors/bad-request-error";
import { toCents } from "@/utils/money";
interface Membership {
   role: Role,
}
interface Product {
    name: string,
    price: number,
    measureUnit: ProductUnit
}

export async function updateProductService(userId: string, id: string, membership: Membership, item: Product) {
    const { name, price, measureUnit } = item

    const { cannot } = getUserPermissions(userId, membership.role)
    
    if (cannot('update', 'Project')) {
      throw new BadRequestError('Você não tem permissão para atualizar produtos')
    }

    if (name.length === 0) {
      throw new BadRequestError('O nome do produto não foi informado.')
    }
    
    const product = await prisma.product.findFirst({
      where: {
        id,
        deletedAt: null
      }
    })

    if (!product) {
      throw new BadRequestError('Produto não encontrado.')
    }

    await prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        name,
        price: toCents(price),
        measureUnit
      }
    })
}