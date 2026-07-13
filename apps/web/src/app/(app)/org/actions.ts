'use server'

import { revalidateTag } from 'next/cache'

import { validarCPF } from '@/utils/cpf-utils'
import { validarCNPJ } from '@/utils/cnpj-utils'
import { ActionResult } from '@/types/action-result'

import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from '@saas/contracts/organization'

import { Organization } from '@saas/contracts/organization'

import { organizationsClient } from '@/http/modules/organizations/organizations.client'

export async function createOrganizationAction(
  data: FormData,
): Promise<ActionResult<Organization>> {
  const values = Object.fromEntries(data)
  const result = createOrganizationSchema.safeParse(values)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { cpfCnpj, personType } = result.data
  const document = cpfCnpj.replace(/\D/g, '')

  if (
    (personType === 'FISICA' && !validarCPF(document)) ||
    (personType === 'JURIDICA' && !validarCNPJ(document))
  ) {
    return {
      success: false,
      message: 'CPF/CNPJ inválido',
    }
  }

  const payload = {
    ...result.data,
    cpfCnpj: document,
  }

  try {
    const organization = await organizationsClient.create(payload)

    revalidateTag('organizations')

    return {
      success: true,
      data: organization as Organization,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}

export async function updateOrganizationAction(
  data: FormData,
): Promise<ActionResult<Organization>> {
  const values = Object.fromEntries(data)
  const result = updateOrganizationSchema.safeParse(values)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    const organization = await organizationsClient.update(result.data)

    revalidateTag('organizations')

    return {
      success: true,
      data: organization as Organization,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado',
    }
  }
}
