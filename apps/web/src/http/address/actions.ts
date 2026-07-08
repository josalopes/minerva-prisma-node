'use server'

import { revalidateTag } from 'next/cache'

import { ActionResult } from '@/types/action-result'
import {
  createAddressSchema,
  SetPrimaryAddressInput,
  updateAddressSchema,
} from '@saas/contracts'
import { Address } from '@saas/contracts'
import { addressesClient } from '@/http/modules/addresses/addresses.client'

export async function createAddressAction({
  slug,
  data,
}: {
  slug: string
  data: unknown
}): Promise<ActionResult<Address>> {
  const result = createAddressSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const payload = {
    ...result.data,
  }

  try {
    const addresses = await addressesClient.create({
      slug,
      payload,
    })

    revalidateTag('addresses')

    return {
      success: true,
      data: addresses,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}

export async function updateAddressAction({
  slug,
  id,
  data,
}: {
  slug: string
  id: number
  data: unknown
}): Promise<ActionResult<Address>> {
  const result = updateAddressSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const payload = {
    ...result.data,
  }

  try {
    const address = await addressesClient.update({
      slug,
      id,
      payload,
    })

    revalidateTag('addresses')

    return {
      success: true,
      data: address,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}

export async function deleteAddressAction({
  slug,
  id,
}: {
  slug: string
  id: number
}): Promise<ActionResult<void>> {
  try {
    await addressesClient.delete(slug, id)

    revalidateTag('addresses')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}

export async function setPrimaryAddressAction({
  slug,
  payload,
}: {
  slug: string
  payload: SetPrimaryAddressInput
}): Promise<ActionResult<void>> {
  try {
    await addressesClient.setPrimary({ slug, payload })

    revalidateTag('addresses')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}
