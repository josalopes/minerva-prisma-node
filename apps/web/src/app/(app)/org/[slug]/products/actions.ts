'use server'

import { HTTPError } from 'ky'

import { getCurrentOrg } from '@/auth/auth'
import { createProduct } from '@/http/product/create-product'
import { deleteProduct } from '@/http/product/delete-product'
import { updateProduct } from '@/http/product/update-product'
import { productSchema } from './schemas'

interface UpdateProductProps {
  productId: string
  name: string
  code: string
  price: string
  measureUnit: string
}

export async function createProductAction(data: FormData) {
  const entries = Object.fromEntries(data.entries())

  const result = productSchema.safeParse(entries)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, code, price, measureUnit } = result.data

  const priceRaw = parseFloat(price.replace(/\./g, '').replace(',', '.'))

  try {
    const org = await getCurrentOrg()

    await createProduct({
      org: org!,
      name,
      code,
      price: Number(priceRaw),
      measureUnit,
    })
  } catch (err) {
    console.log('entrou no catch')
    if (err instanceof HTTPError) {
      console.log('erro de HTTPError')
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado ao criar produto',
      errors: null,
    }
  }

  return { success: true, message: 'Produto salvo com sucesso', errors: null }
}

export async function deleteProductAction(productCode: string) {
  try {
    const org = await getCurrentOrg()

    await deleteProduct({
      org: org!,
      productCode,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado ao deletar o produto',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Produto deletado com sucesso',
    errors: null,
  }
}

export async function updateProductAction({
  productId,
  name,
  code,
  price,
  measureUnit,
}: UpdateProductProps) {
  const data = {
    productId,
    name,
    code,
    price,
    measureUnit,
  }

  const result = productSchema.safeParse(data)

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors
    return { success: false, message: null, errors }
  }

  const org = await getCurrentOrg()
  const priceRaw = parseFloat(price.replace(/\./g, '').replace(',', '.'))

  try {
    await updateProduct({
      productId,
      org: org!,
      name,
      code,
      price: Number(priceRaw),
      // price: priceInCents,
      measureUnit,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      return {
        success: false,
        message,
        errors: null,
      }
    }

    return {
      success: false,
      message: 'Erro inesperado ao atualizar o produto',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Produto atualizado com sucesso',
    errors: null,
  }
}
