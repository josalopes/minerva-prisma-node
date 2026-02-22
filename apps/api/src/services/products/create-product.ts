import { prisma } from "@/lib/prisma";
import { ProductUnit, Role } from "@prisma/client";
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

interface Product {
    name: string,
    code: string,
    price: number,
    measureUnit: ProductUnit
}


export async function createProductService(
    slug: string, 
    userId: string, 
    organization: Organization, 
    membership: Membership,
    item: Product
) {
    const { name, code, price, measureUnit } = item

    if (!organization) {
        throw new BadRequestError('Organização inexistente')
    }
    
    const { cannot } = getUserPermissions(userId, membership.role)
    
    if (cannot('create', 'Project')) {
        throw new BadRequestError('Você não tem permissão para criar projetos')
    }  
    
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
                organizationId: organization.id
            },
        })

        if (productByCodej) {
            throw new BadRequestError('Já existe um produto com este código nesta organização.')
        }
    }

    const product = await prisma.product.create({
        data: {
            name,
            code,
            price,
            organizationId: organization.id,
            measureUnit,
        },
    })  

    return { product }
}