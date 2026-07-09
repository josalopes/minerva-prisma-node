'use client'

import { useEffect } from 'react'
import { UseFormReturn } from 'react-hook-form'

import { useStepController } from '@/hooks/use-step-controller'
import { useCnpjLookupFlow } from '@/hooks/use-cnpj-lookup-flow'
import { useFocusFirstError } from '@/hooks/use-focus-first-error'
import { useDocumentField } from '@/hooks/use-document-field'
import { useCompanyPreview } from '@/hooks/use-company-preview'

import { CreateOrgContext } from '@/types/create-org-flow'
import { FormFieldUniversal } from '@/lib/form-field-universal'
import { autoFill } from '@/utils/auto-fill-form'
import { FormRadioGroup } from '../../form-radio-group'
import { FormCheckbox } from '../../form-checbox'

type Props = {
  form: UseFormReturn<any>
  flow: any
  preview: ReturnType<typeof useCompanyPreview>
}

export function Step0BasicInfo({ form, flow, preview }: Props) {
  const step1 = useStepController<CreateOrgContext, 'step1'>(flow, 'step1')

  const handled = step1.data?.companyHandled ?? false
  const cnpjValue = form.watch('cpfCnpj') ?? ''
  const documentField = useDocumentField({ form })

  useFocusFirstError(form, flow.step)

  // =========================
  // 🔥 LOOKUP (agora globalizado)
  // =========================
  useCnpjLookupFlow({
    flow,
    stepIndex: 0,
    cnpj: cnpjValue,
    handled,
    preview,
    onApply: applyCompany,
  })

  // =========================
  // 🔥 REIDRATAÇÃO
  // =========================
  useEffect(() => {
    if (!step1.data) return

    form.reset(step1.data)
  }, [step1.data, form])

  // =========================
  // 🔥 APPLY COMPANY (via modal global)
  // =========================
  function applyCompany(data: any) {
    const values = {
      cpfCnpj: data.document,
      name: data.tradeName || data.name,
      domain: data.email?.split('@')[1] || '',
    }

    autoFill(form, values)

    flow.context.set('addressFromCnpj', data.address)
    flow.context.set('addressSource', 'cnpj')

    step1.mutate((draft) => {
      Object.assign(draft, values)
      draft.companyHandled = true
    })

    preview.close()
  }

  // =========================
  // 🔥 HANDLE NEXT
  // =========================
  function clearPersonFields() {
    form.reset({
      personType: form.getValues('personType'),
      name: '',
      domain: '',
      cpfCnpj: '',
      shouldAttachUserByDomain: false,
    })

    preview.reset()

    flow.context.set('step1', undefined)
  }

  // =========================
  // 🔥 RENDER
  // =========================
  return (
    <form className="space-y-8">
      <FormRadioGroup
        control={form.control}
        name="personType"
        label="Tipo de pessoa"
        options={[
          { label: 'Pessoa Jurídica', value: 'JURIDICA' },
          { label: 'Pessoa Física', value: 'FISICA' },
        ]}
        onSelectionChange={(previous, current) => {
          if (previous !== current) {
            clearPersonFields()
          }
        }}
      />

      <FormFieldUniversal
        control={form.control}
        form={form}
        name="cpfCnpj"
        label={documentField.label}
        placeholder="Digite o documento"
        transform={documentField.transform}
      />
      {documentField.error && (
        <p className="text-muted-foreground text-sm">
          Não foi possível buscar os dados automaticamente. Você pode preencher
          manualmente.
        </p>
      )}

      <FormFieldUniversal
        control={form.control}
        form={form}
        name="name"
        label="Nome"
        placeholder="Digite o nome da organização"
      />

      <div className="space-y-8">
        <FormFieldUniversal
          control={form.control}
          form={form}
          name="domain"
          label="Domínio"
          placeholder="empresa.com.br"
        />
      </div>

      <div className="space-y-8">
        <FormCheckbox
          control={form.control}
          name="shouldAttachUserByDomain"
          label="Automaticamente vincular membros"
          description="Usuários com o mesmo domínio serão adicionados automaticamente"
        />
      </div>
    </form>
  )
}
