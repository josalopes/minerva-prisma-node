'use server'
import { z } from 'zod'
import { HTTPError } from 'ky'

import { createProduct } from '@/http/product/create-product'
import { getCurrentOrg } from '@/auth/auth'
import { deleteProduct } from '@/http/product/delete-product'

const productSchema = z.object({
    name: z.string().min(4, { message: 'O nome deve ter no mínimo 4 caracteres'}),
    code: z.string(),
    price: z.string(),
    measureUnit: z.string()
})

export async function createProductAction(data: FormData) {
    const entries = Object.fromEntries(data.entries())
    const result = productSchema.safeParse(entries)
    
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        
        return { success: false, message: null, errors }
    }

    const { name, code, price, measureUnit } = result.data

    const priceNum = parseInt(price)

    try {
        const org = await getCurrentOrg();

        await createProduct({
            org: org!, 
            name, 
            code,
            price: priceNum, 
            measureUnit
        })          
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
            message: 'Erro inesperado ao criar projeto', 
            errors: null
         }
    }

    return { success: true, message: 'Produto salvo com sucesso', errors: null }
}

export async function DeleteProductAction(productCode: string) {
    try {
        const org = await getCurrentOrg();

        await deleteProduct({
            org: org!, 
            productCode,
        })          
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
            message: 'Erro inesperado ao deletar o produto', 
            errors: null
         }
    }

    return { success: true, message: 'Produto deletado com sucesso', errors: null }
}


