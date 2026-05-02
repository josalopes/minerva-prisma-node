"use server"


import { revalidateTag } from 'next/cache'

import { ActionResult } from '@/types/action-result'

import { createAddressSchema, updateAddressSchema     
  } from "../../../../../packages/contracts/address"

  import { Address     
  } from "../../../../../packages/contracts/address"

import { addressesClient } from '@/http/modules/addresses/addresses.client'

export async function createAddressAction(data: unknown): Promise<ActionResult<Address>> {
    const result = createAddressSchema.safeParse(data)

    if (!result.success) {
        return {
        success: false,
        errors: result.error.flatten().fieldErrors
        }
    }

    const payload = {
        ...result.data,
    }

    try {
        const addresses = await addressesClient.create(result.data) 

        revalidateTag('addresses')

        return { 
            success: true,
            data: addresses
        }
    } catch (error) {
        return {
            success: false,
            message:
            error instanceof Error
                ? error.message
                : "Erro inesperado"
        }
    }  
}


export async function updateAddressAction(data: unknown) {
    const result = updateAddressSchema.safeParse(data)
    
    if (!result.success) {
        return {
        success: false,
        errors: result.error.flatten().fieldErrors
        }
    }

    try {
        const address = await addressesClient.update(result.data) 
        
        revalidateTag('addresses')

        return { 
            success: true,
            data: address
        }
    } catch (error) {
        return {
            success: false,
            message:
            error instanceof Error
                ? error.message
                : "Erro inesperado"
        }
    }
}
