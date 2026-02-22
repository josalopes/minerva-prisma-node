'use server'

import { HTTPError } from 'ky'

import { getCurrentOrg } from '@/auth/auth'
import { createProduct } from '@/http/product/create-product'
import { deleteProduct } from '@/http/product/delete-product'
import { updateProduct } from '@/http/product/update-product'
import { productSchema } from './schemas'
import { ConvertRealToCents } from '@/utils/convertCurrency'

interface UpdateProductProps {
    productId: number;
    name: string;
    code: string;
    price: string;
    measureUnit: string;
}

export async function createProductAction(data: FormData) {
    const entries = Object.fromEntries(data.entries())
    const result = productSchema.safeParse(entries)
    
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        
        return { success: false, message: null, errors }
    }
    
    const { name, code, price, measureUnit } = result.data

    const priceInCents = ConvertRealToCents(price);

    try {
        const org = await getCurrentOrg();

        await createProduct({
            org: org!, 
            name, 
            code,
            price: priceInCents, 
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
            message: 'Erro inesperado ao criar produto', 
            errors: null
         }
    }

    return { success: true, message: 'Produto salvo com sucesso', errors: null }
}

export async function deleteProductAction(productCode: string) {
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

export async function updateProductAction({ productId, name, code, price, measureUnit }: UpdateProductProps) {
    const data = {
        productId,
        name,
        code,
        price, 
        measureUnit
    }

    const result = productSchema.safeParse(data)
    
    if (!result.success) {
        const errors = result.error.flatten().fieldErrors
        return { success: false, message: null, errors }
    }
    
    const org = await getCurrentOrg();
    const priceInCents = ConvertRealToCents(price);

    try {
        await updateProduct({
            productId,
            org: org!, 
            name,
            code,
            price: priceInCents,
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
            message: 'Erro inesperado ao atualizar o produto', 
            errors: null
         }
    }

    return { success: true, message: 'Produto atualizado com sucesso', errors: null }
}
