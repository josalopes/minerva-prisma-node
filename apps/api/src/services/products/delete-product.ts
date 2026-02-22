import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { BadRequestError } from "../../http/routes/-errors/bad-request-error";

interface Organization {
    id: string,
    name: string,
    cpfCnpj: string,
    slug: string,
    domain: string | null,
    shouldAttachUserByDomain: boolean,
    avatarUrl: string | null,
    logoUrl: string | null,
    personType: string,
    stripeCustomerId: string | null,
    email: string | null,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
    ownerId: string | null,
}

interface Membership {
   id: string,
   role: Role,
   organizationId: string,
   createdAt: Date,
   updatedAt: Date,
   deletedAt: Date | null,
   email: string | null,
   userId: string,
   cpf: string | null, 
}

export async function deleteProductService( 
    userId: string, 
    organization: Organization, 
    membership: Membership,
    productCode: string
) {
    const { cannot } = getUserPermissions(userId, membership.role)

    // if (cannot('delete', authProduct)) {
    //     return reply.status(401).send({ message: 'Você não tem permissão para deletar produtos' })
    // }

    const product = await prisma.product.findFirst({
        where: {
            code: productCode,
            organizationId: organization.id
        }
    })

    if (!product) {
        throw new BadRequestError('Produto não encontrado')
    }

    const productId = product.id

    await prisma.product.update({
        where: {
            id: productId
        },
        data: {
            deletedAt: new Date()
        }
    })
}
