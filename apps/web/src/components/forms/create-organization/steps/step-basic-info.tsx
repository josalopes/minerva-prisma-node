"use client"

import { UseFormReturn } from "react-hook-form"
import { CreateOrganizationFormData } from "@/schemas/create-organization-form"

import { Form } from "@/components/ui/form"

import { FormInput } from "../../form-input"
import { FormRadioGroup } from "../../form-radio-group"
import { FormCheckbox } from "../../form-checbox"

export function Step0BasicInfo({ form }: { form: UseFormReturn<CreateOrganizationFormData> }) { 
    const { watch } = form
    const selectedPersonType = watch("personType")
    const inputSize = selectedPersonType === 'FISICA' ? 14 : 18

    return (
        <Form {...form}>
            <form className="space-y-8">
                <div className="space-y-1">
                    <FormInput
                        control={form.control}
                        name="name"
                        label="Organização"
                        placeholder="Digite o nome da organização"
                    />
                </div>

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
                    <FormInput
                        control={form.control}
                        name="cpfCnpj"
                        label="CPF/CNPJ"
                        placeholder="Digite o documento"
                    />
                </div>
                
                <div className="space-y-8">
                    <FormInput
                        control={form.control}
                        name="domain"
                        label="Domínio do e-mail"
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
        </Form>
        // <div className="space-y-8">


                
        // </div>
  )
}