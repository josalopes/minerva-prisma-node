'use client'

import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { AddressFormData } from '@/schemas/address-form'
import { useFocusFirstError } from '@/hooks/use-focus-first-error'

import { useFormFlow } from '@/lib/use-form-flow'
import { CreateOrgContext } from '@/types/create-org-flow'
import { useStepController } from '@/hooks/use-step-controller'
import { AddressFields } from '@/components/address/address-fields'
import { useAddressLookup } from '@/components/address/use-address-lookup'

export type CreateOrgFlow = ReturnType<typeof useFormFlow<CreateOrgContext>>
interface Step1AddressProps {
  form: UseFormReturn<AddressFormData>
  flow: CreateOrgFlow
}

export function Step1Address({ form, flow }: Step1AddressProps) {
  const [mode, setMode] = useState('new')

  const addressFromCnpj = flow.context.get('addressFromCnpj')

  const source = flow.context.get('addressSource')

  const step1 = useStepController<CreateOrgContext, 'step1'>(flow, 'step1')

  const { cepField, cepPreview, handleUseCep } = useAddressLookup({
    form,
    source,
    addressFromCnpj,

    onSourceChange: (value) => flow.context.set('addressSource', value),

    onAddressFromCnpjConsumed: () =>
      flow.context.set('addressFromCnpj', undefined),
  })

  useEffect(() => {
    const saved = flow.context.get('step1').addressMode ?? 'new'

    setMode(saved)
  }, [])

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
