"use server"
import { z } from 'zod'
import { HTTPError } from 'ky'

import { createOrganization } from '@/http/create-organization'
import { getCurrentOrg } from '@/auth/auth'
import { updateOrganization } from '@/http/update-organization'
import { revalidateTag } from 'next/cache'

import { validarCPF } from '../../../utils/cpf-utils'
import { validarCNPJ } from '../../../utils/cnpj-utils'

const organizationSchema = z.object({
    name: z.string().min(4, { message: 'O nome deve ter no mínimo 4 caracteres'}),
    cpfCnpj: z.string({ message: 'CPF/CNPJ é obrigatório.' })
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return replacedDoc.length >= 11;
        }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
        .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return replacedDoc.length <= 14;
        }, 'CPF/CNPJ deve conter no máximo 14 caracteres.')
        .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return !!Number(replacedDoc);
        }, 'CPF/CNPJ deve conter apenas números.'),
    personType: z.string(),
    domain: z.string()
    .nullish()
    .refine((value) => {
        if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
        }

        return true
    },

{
    message: 'Entre com um domínio válido'
})
    .transform((value) => value ?? undefined),
   shouldAttachUsersByDomain: z.union([
        z.literal('on'),
        z.literal('off'),
        z.boolean(),
    ])
    .transform((value) => value === true || value === 'on')
    .default(false)
})
.refine(
    (data) => {
        if (data.shouldAttachUsersByDomain === true && !data.domain) {
            return false
        }

        return true
    },
    {
        message: 'O domínio é obrigatório ao habilitar a auto-vinculação'
    }
)

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
    const entries = Object.fromEntries(data.entries())
    const result = organizationSchema.safeParse(entries)
    
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }
    const { name, cpfCnpj, domain, shouldAttachUsersByDomain, personType } = result.data
    const unmaskedCpfCnpj = cpfCnpj.toString().replace(/\.|-/gm,'')

    switch (personType) {
        case "FISICA":
            if (!validarCPF(unmaskedCpfCnpj)) {
                return { 
                    success: false, 
                    message: 'CPF inválido', 
                    errors: null
                }
            }
            break
        case "JURIDICA":
            if (!validarCNPJ(unmaskedCpfCnpj)) {
                return { 
                    success: false, 
                    message: 'CNPJ inválido', 
                    errors: null
                }
            }
            break    
    }

    try {
        await createOrganization({
            name, 
            cpfCnpj: unmaskedCpfCnpj, 
            domain, 
            shouldAttachUsersByDomain, 
            personType
        }) 
        
        revalidateTag('organizations')
    } catch (err) {
        if (err instanceof HTTPError) {
            const { message, status } = await err.response.json()
            return { 
                success: false, 
                message, 
                errors: null
             }    
        }

        return { 
            success: false, 
            message: 'Erro inesperado ao criar organização', 
            errors: null
         }
    }

    return { 
        success: true,
        message: 'Organização salva com sucesso', 
        errors: null 
    }
}


export async function updateOrganizationAction(data: FormData) {
    const currentOrg = await getCurrentOrg()
    
    const entries = Object.fromEntries(data.entries())
    const result = organizationSchema.safeParse(entries)
    
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        
        return { success: false, message: null, errors }
    }

    const { name, domain, shouldAttachUsersByDomain } = result.data

    try {
        await updateOrganization({
            org: currentOrg!,
            name, 
            domain, 
            shouldAttachUsersByDomain,
        })   
        
        revalidateTag('organizations')
    } catch (err) {
        if (err instanceof HTTPError) {
            const { message, status } = await err.response.json()
            return { 
                success: false, 
                message, 
                errors: null
             }    
        }

        return { 
            success: false, 
            message: 'Erro inesperado ao criar organização', 
            errors: null
         }
    }

    return { success: true, message: 'Organização salva com sucesso', errors: null }
}

