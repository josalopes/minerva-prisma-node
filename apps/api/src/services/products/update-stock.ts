import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../../http/routes/-errors/bad-request-error";

interface Membership {
   role: Role,
}

interface Product {
    stock: number,
}

export async function updateStockService(userId: string, id: string, membership: Membership, item: Product) {
    const { stock } = item

    const { cannot } = getUserPermissions(userId, membership.role)
    
    if (cannot('update', 'Project')) {
        throw new BadRequestError('Você não tem permissão para atualizar produtos')
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

    const newStock = product.stock + stock

    await prisma.product.update({
      where: {
        id: product.id
      },
      data: {
        stock: newStock,
      }
    })
}