import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../../http/routes/-errors/bad-request-error";
import { fromCents } from "@/utils/money";

interface Membership {
   role: Role,
}

export async function getProductService(
    userId: string, 
    organizationId: string, 
    membership: Membership,
    productCode: string
) {
    
    const { cannot } = getUserPermissions(userId, membership.role)
    
    if (cannot('create', 'Project')) {
        throw new BadRequestError('Você não tem permissão para visualizar produtos')
    }
    
    const product = await prisma.product.findFirst({
        select: {
            id: true,
            name: true,
            code: true,
            price: true,
            organizationId: true,
            measureUnit: true,
        },
        where: {
            code: productCode,
            organizationId,
            deletedAt: null
        }
    })

    if (!product) {
        throw new BadRequestError('Produto não encontrado nesta organização')
    }

    return {
      ...product,
      price: fromCents(product.price)

    }
}