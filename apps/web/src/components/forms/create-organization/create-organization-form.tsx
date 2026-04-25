"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createOrganizationAction, updateOrganizationAction } from "@/app/(app)/org/actions";
import { createAddressAction, updateAddressAction } from "@/http/address/actions";

import { Step0BasicInfo } from "./steps/step-basic-info"
import { Step1Address } from "./steps/step-address"
import { Step2Logo } from "./steps/step-logo"
import { Step3Avatar } from "./steps/step-avatar"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrganizationFormSchema } from "@/schemas/create-organization-form"
import { createAddressFormSchema } from "@/schemas/create-address-form"
import { useFormFlow } from "@/lib/use-form-flow"
import { FormFlowLayout } from "./form-flow-layout"
import { useAutoSaveStatus } from "@/lib/autosave-status"
import { useScrollOnStep } from "@/lib/scroll"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FlowStep } from "@/types/form-flow-types"
import { CreateOrgContext } from "@/types/create-org-flow"
import { useCompanyPreview } from "@/hooks/use-company-preview"
import { CompanyPreviewModal } from "./company-preview-modal"

export function CreateOrganizationForm() {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [name, setName] = useState<string>("")
  const preview = useCompanyPreview()

  const router = useRouter()

  const orgForm = useForm({
    resolver: zodResolver(createOrganizationFormSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      cpfCnpj: "",
      domain: "",
      personType: "JURIDICA",
    shouldAttachUserByDomain: false,
  }
  })

  const addressForm = useForm({
    resolver: zodResolver(createAddressFormSchema),
    defaultValues: {
      type: "GENERAL",
      street: "",
      number: "",
      complement: "",
      district: "",
      city: "",
      state: "",
      zipCode: "",
      isPrimary: true,
      isNew: "new",
    }
  })

  function nextWithSave<K extends keyof CreateOrgContext>(
    key: K,
    form: UseFormReturn<any>
  ) {
    flow.context.set(key, form.getValues())
    return flow.next()
  }


  const steps: FlowStep<any, CreateOrgContext>[] = [
    {          
      id: "organization",
      label: "Informações",
      form: orgForm,

      onSubmit: async (values, ctx) => {
        const organizationId = ctx.get("organizationId")
        const slug = ctx.get("slug")

        // CREATE
        if (!organizationId) {
          const result = await createOrganizationAction(values)

          if (!result.success) {
            throw new Error(result.message ?? "Erro desconhecido")
          }

          return {
            type: "create",
            data: result.data
          }
        }

        // UPDATE
        const result = await updateOrganizationAction({
          ...values,
          slug
        })

        if (!result.success) {
          throw new Error(result.message)
        }

        return {
          type: "update",
          data: result.data
        }                                                                                                     
      },

      onSuccess: (res, ctx) => {
        if (res.type === "create") {
          ctx.set("organizationId", res.data.id)
          ctx.set("slug", res.data.slug)
          setName(res.data.name)
          setAvatarUrl(res.data.avatarUrl)
          setLogoUrl(res.data.logoUrl)

          toast.success("Organização criada")
        } else {
          toast.success("Organização atualizada")
        }
      }
    },

    {
      id: "address",
      label: "Endereço",
      form: addressForm,
      optional: true,

      onSubmit: async (values, ctx) => {
        const organizationId = ctx.get("organizationId")
        const addressId = ctx.get("addressId")
        const mode = ctx.get("addressMode")

        if (!organizationId) {
          throw new Error("Organização não criada")
        }

        // CREATE (primeira vez)
        if (!addressId) {
          const result = await createAddressAction({
            ...values,
            ownerId: organizationId,
            ownerType: "organization"
          })

          if (!result.success) {
            throw new Error(result.message ?? "Erro desconhecido")
          }

          return {
            type: "create",
            data: result.data
          }
        }

        // CREATE NOVO
        if (mode === "new") {
          const result = await createAddressAction({
            ...values,
            ownerId: organizationId,
            ownerType: "organization"
          })


          if (!result.success) {
            throw new Error(result.message ?? "Erro desconhecido")
          }

          return {
            type: "create-new",
            data: result.data
          }
        }

        // UPDATE
        const result = await updateAddressAction({
          ...values,
          id: addressId
        })

        if (!result.success) {
          throw new Error(result.message)
        }

        return {
          type: "update",
          data: result.data
        }
      },

      onSuccess: (res, ctx) => {
        if (res.type === "create" || res.type === "create-new") {
          ctx.set("addressId", res.data.id)
          toast.success("Endereço criado")
        } else {
          toast.success("Endereço atualizado")
        }
      }
    },

    {
      id: "logo",
      label: "Logo",
      optional: true,

      onSubmit: async (_, ctx) => {
        const orgId = ctx.get("organizationId")

        const organization = {
          id: orgId,
          name,
          slug,
          avatarUrl,
          logoUrl        
        }        
      },
    },

    {
      id: "avatar",
      label: "Avatar",
      optional: true,

      onSubmit: async (_, ctx) => {
        const orgId = ctx.get("organizationId")

        const organization = {
          id: orgId,
          name,
          slug,
          avatarUrl,
          logoUrl        
        }
      }
    }    
  ]
  

  const flow = useFormFlow<CreateOrgContext>(steps, { 
    storageKey: "create-form-flow"
  })

  useScrollOnStep(flow.step)

  const saveStatus = useAutoSaveStatus({
    step: flow.step,
    context: flow.context.data
  })

  const slug = flow.context.get("step1")?.slug

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="mt-4 mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-5xl flex-1 min-h-0 flex flex-col">
        <Card className="flex-1 min-h-0 flex flex-col shadow-sm border bg-background backdrop-blur">
          {/* <CardHeader>
            <CardTitle>Criar Organização</CardTitle>
          </CardHeader> */}
          <CardContent className="flex-1 min-h-0 p-8">
              <FormFlowLayout
                steps={flow.steps}
                currentStep={flow.step} 
                stepErrors={flow.stepErrors}               
                variant="auto"
                onStepClick={(index) => {
                  if (index <= flow.step || flow.stepErrors[index]) {
                    flow.goTo(index)
                  }
                }}

                header={
                  <div className="flex items-center justify-between w-full">
                    <span>Criar Organização</span>

                    {/* <span className="text-xs text-muted-foreground">
                      {saveStatus === "saving" && "💾 Salvando..."}
                      {saveStatus === "saved" && "✔ Salvo"}
                    </span> */}
                  </div>
                }

                footer={
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={flow.back}
                        disabled={flow.step === 0}
                      >
                        Voltar
                      </Button>

                      {flow.steps[flow.step]?.optional && (
                        <Button 
                          variant="ghost" 
                          onClick={flow.skip}
                        >
                          Pular
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">                  
                      {/* <Button className="mr-4"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          toast.success("Progresso salvo!")
                        }}
                      >
                        Salvar e continuar depois
                      </Button> */}

                      <Button className="transition-all active:scale-95"
                        type="button"
                        onClick={() => nextWithSave("step1", orgForm)}
                        disabled={flow.isLoading}
                      >
                        {flow.isLoading ? "Salvando..." : "Próximo"}
                      </Button>

                      <Button
                        disabled={!slug}
                        onClick={async () => {                          
                          if (slug) {
                            await flow.finish()
                            toast.success("Cadastro concluído")
                            router.push(`/org/${slug}`)
                          } else {
                            router.push("/dashboard") // fallback
                          }
                        }}
                      >
                        {/* {slug ? "Finalizar" : "Criando organização..."} */}
                        Finalizar
                      </Button>

                    </div>
                  </div>
                }
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={flow.step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25, ease: "easeInOut"}}
                  >
                    {flow.step === 0 && (
                      <FormProvider {...orgForm}>
                        <Step0BasicInfo 
                          form={orgForm} 
                          flow={flow}
                          preview={preview}
                        />                        
                      </FormProvider>
                    )}

                    {flow.step === 1 && (
                      <FormProvider {...addressForm}>
                        <Step1Address 
                          form={addressForm} 
                          flow={flow} 
                          preview={preview}
                        />

                      </FormProvider>
                    )}
                    {flow.step === 2 && Step2Logo({ id: flow.context.get("step1")?.organizationId, name, slug, avatarUrl, logoUrl })}
                    {flow.step === 3 && Step3Avatar({ id: flow.context.get("step1").organizationId, name, slug, avatarUrl, logoUrl })}
                  </motion.div>
                </AnimatePresence>
              </FormFlowLayout>
          </CardContent>
        </Card>
      </div>
      <CompanyPreviewModal
        open={preview.open}
        data={preview.data}
        isLoading={false}
        onApply={preview.apply}
        onClose={preview.close}
      />
    </div>
  )
}