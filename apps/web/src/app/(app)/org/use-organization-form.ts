'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
export interface UseOrganizationFormProps {
  initialValues?: {
    name: string
    cpfCnpj: string
    personType: 'JURIDICA' | 'FISICA'
    domain?: string | null | undefined
    shouldAttachUserByDomain: boolean
  }
}

const organizationSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: 'O nome deve ter no mínimo 4 caracteres' }),
    cpfCnpj: z
      .string({ message: 'CPF/CNPJ é obrigatório.' })
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '')
        return replacedDoc.length >= 11
      }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '')
        return replacedDoc.length <= 14
      }, 'CPF/CNPJ deve conter no máximo 14 caracteres.')
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '')
        return !!Number(replacedDoc)
      }, 'CPF/CNPJ deve conter apenas números.'),
    personType: z.string(),
    domain: z
      .string()
      .nullish()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },

        {
          message: 'Entre com umm domínio válido',
        },
      ),
    shouldAttachUserByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUserByDomain === true && !data.domain) {
        return false
      }

      return true
    },
    {
      message: 'O domínio é obrigatório ao habilitar a auto-vinculação',
    },
  )

export type OrganizationFormData = z.input<typeof organizationSchema>

export function useOrganizationForm({
  initialValues,
}: UseOrganizationFormProps = {}) {
  return useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      cpfCnpj: initialValues?.cpfCnpj ?? '',
      personType: initialValues?.personType ?? 'JURIDICA',
      domain: initialValues?.domain ?? '',
      shouldAttachUserByDomain:
        initialValues?.shouldAttachUserByDomain ?? false,
    },
  })
}
