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

export async function getProductService(
    userId: string, 
    organization: Organization, 
    membership: Membership,
    productCode: string
) {
    
    if (!organization) {
        throw new BadRequestError('Organização inexistente')
    }
        
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
            organizationId: organization.id,
            deletedAt: null
        }
    })

    if (!product) {
        throw new BadRequestError('Produto não encontrado nesta organização')
    }

    return product
}