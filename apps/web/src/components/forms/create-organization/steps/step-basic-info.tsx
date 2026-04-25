"use client"

import { useEffect, useState } from "react"
import { Form, UseFormReturn } from "react-hook-form"

import { useStepController } from "@/hooks/use-step-controller"
import { useCnpjLookupFlow } from "@/hooks/use-cnpj-lookup-flow"


import { CreateOrgContext } from "@/types/create-org-flow"
import { FormRadioGroup } from "../../form-radio-group"
import { FormFieldUniversal } from "@/lib/form-field-universal"
import { FormCheckbox } from "../../form-checbox"
import { useFocusFirstError } from "@/hooks/use-focus-first-error"
import { useDocumentField } from "@/hooks/use-document-field"
import { useCompanyPreview } from "@/hooks/use-company-preview"

type Props = {
  form: UseFormReturn<any>
  flow: any
  preview: ReturnType<typeof useCompanyPreview>
}

export function Step0BasicInfo({ form, flow, preview }: Props) {
  const step1 = useStepController<CreateOrgContext, "step1">(flow, "step1")
  const handled = step1.data?.companyHandled ?? false
  const cnpjValue = form.watch("cpfCnpj") ?? ""
  const documentField = useDocumentField({ form })

  const [isEditable, setIsEditable] = useState(true)

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
    onApply: applyCompany // 🔥 chave da arquitetura nova
  })

  // =========================
  // 🔥 REIDRATAÇÃO
  // =========================
  useEffect(() => {
    if (step1.data && Object.keys(step1.data).length > 0) {
      form.reset(step1.data)
    }
  }, [])

  // =========================
  // 🔥 APPLY COMPANY (via modal global)
  // =========================
  function applyCompany(data: any) {
    form.setValue("name", data.tradeName || data.name)
    form.setValue("domain", data.email?.split("@")[1] || "")

    flow.context.set("addressFromCnpj", {
      street: data.address.street,
      complement: data.address.complement,
      district: data.address.district,
      city: data.address.city,
      state: data.address.state,
      zipCode: data.address.zipCode
    })

    flow.context.set("addressSource", "cnpj")

    step1.mutate(draft => {
      draft.companyHandled = true
    })

    setIsEditable(false)
    preview.close()
  }

  // =========================
  // 🔥 HANDLE NEXT
  // =========================
  async function handleNext() {
    step1.mutate(draft => {
      Object.assign(draft, form.getValues())
      draft.companyHandled = true // 🔥 ESSENCIAL
    })

    preview.reset() // 🔥 garante que não vaza estado
    await flow.next()
  }

  // =========================
  // 🔥 RENDER
  // =========================
      return (
        <>
            <Form {...form}>
                <form className="space-y-8">
                    <div className="space-y-1">
                        <FormRadioGroup
                            control={form.control}
                            name="personType"
                            label="Tipo de pessoa"
                            options={[
                                { label: "Pessoa Jurídica", value: "JURIDICA" },
                                { label: "Pessoa Física", value: "FISICA" }
                            ]}
                        />
                    </div>

                    <div className="space-y-8">
                        <FormFieldUniversal
                            control={form.control}
                            form={form}
                            name="cpfCnpj"
                            label={documentField.label}
                            placeholder="Digite o documento"
                            transform={documentField.transform}
                            // asyncField={documentField.async}
                        />
                    </div>
                    {/* {documentField.error && (
                        <p className="text-sm text-muted-foreground">
                            Não foi possível buscar os dados automaticamente.
                            Você pode preencher manualmente.
                        </p>
                    )} */}

                    <div className="space-y-1">
                        <FormFieldUniversal
                            control={form.control}
                            form={form}
                            name="name"
                            label="Nome"
                            placeholder="Digite o nome da organização"
                        />
                    </div>

                    <div className="space-y-8">
                        <FormFieldUniversal
                            control={form.control}
                            form={form}
                            name="domain"
                            label="Domínio"
                            placeholder="empresa.com.br"
                            // asyncField={domainField}
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
            </Form>
        </>
    )
}
