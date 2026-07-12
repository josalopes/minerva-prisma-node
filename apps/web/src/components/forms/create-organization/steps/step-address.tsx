'use client'

import { UseFormReturn } from 'react-hook-form'

import { AddressFormData } from '@/schemas/address-form'
import { useFocusFirstError } from '@/hooks/use-focus-first-error'

import { useFormFlow } from '@/lib/use-form-flow'
import { CreateOrgContext } from '@/types/create-org-flow'
import { AddressFields } from '@/components/address/address-fields'
import { useAddressLookup } from '@/components/address/use-address-lookup'

export type CreateOrgFlow = ReturnType<typeof useFormFlow<CreateOrgContext>>
interface Step1AddressProps {
  form: UseFormReturn<AddressFormData>
  flow: CreateOrgFlow
}

export function Step1Address({ form, flow }: Step1AddressProps) {
  const addressFromCnpj = flow.context.get('addressFromCnpj')

  const source = flow.context.get('addressSource')

  const { cepField, cepPreview, handleUseCep } = useAddressLookup({
    form,
    source,
    addressFromCnpj,

    onSourceChange: (value) => flow.context.set('addressSource', value),

    onAddressFromCnpjConsumed: () =>
      flow.context.set('addressFromCnpj', undefined),
  })

  useFocusFirstError(form, flow.step)

  return (
    <AddressFields
      form={form}
      cepField={cepField}
      source={source}
      cepPreview={cepPreview}
      onUseCep={handleUseCep}
    />
  )
}
