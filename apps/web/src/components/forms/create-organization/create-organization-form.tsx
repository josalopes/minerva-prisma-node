"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createOrganizationAction, updateOrganizationAction } from "@/app/(app)/org/actions";
import { createAddressAction, updateAddressAction } from "@/http/address/actions";
import { usePersistedForm } from "./use-persisted-form"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FormFlowContext } from "@/lib/form-flow-context"

export function CreateOrganizationForm() {
  const [organizationId, setOrganizationId] = useState<string>("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [name, setName] = useState<string>("")
  const [slug, setSlug] = useState<string>("")

  const orgForm = useForm({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
    shouldAttachUserByDomain: false,
  }
  })

  const addressForm = useForm({
    resolver: zodResolver(createAddressFormSchema)
  })

  usePersistedForm(
    "create-org-step1",
    orgForm.watch,
    orgForm.setValue
  )
  
  usePersistedForm(
    "create-org-step2",
    addressForm.watch,
    addressForm.setValue
  )
  interface OrganizationLogoContentProps {
    id: string;
    name: string;
    slug: string;
    avatarUrl: string | null;
    logoUrl: string | null;
  }

  useEffect(() => {
    const hasDraft = localStorage.getItem("form-flow")

    if (!hasDraft) {
      flow.reset()
    }
  }, [])
  

  const flow = useFormFlow([
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
          setSlug(res.data.slug)
          setName(res.data.name)
          setOrganizationId(res.data.id)
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
        const mode = flow.context.get("addressMode")

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
  ],
  { storageKey: "create-form-flow"}
)

  useScrollOnStep(flow.step)

  const saveStatus = useAutoSaveStatus({
    step: flow.step,
    context: flow.context.data
  })

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="mt-4 mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-5xl flex-1 min-h-0 flex flex-col">
        <Card className="flex-1 min-h-0 flex flex-col shadow-sm border bg-background backdrop-blur">
          {/* <CardHeader>
            <CardTitle>Criar Organização</CardTitle>
          </CardHeader> */}
          <CardContent className="flex-1 min-h-0 p-8">
            <FormFlowContext.Provider value={flow}>            
              <FormFlowLayout
                steps={flow.steps}
                currentStep={flow.step}
                variant="auto"
                onStepClick={(index) => {
                  if (index <= flow.step) {
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
                        <Button variant="ghost" onClick={flow.skip}>
                          Pular
                        </Button>
                      )}
                    </div>

                    <div className="flex gap-2">                  
                      <Button className="mr-4"
                        type="button"
                        variant="outline"
                        onClick={() => {
                          toast.success("Progresso salvo!")
                        }}
                      >
                        Salvar e continuar depois
                      </Button>

                      <Button className="transition-all active:scale-95"
                        type="button"
                        onClick={flow.next}
                        disabled={flow.isLoading}
                      >
                        {flow.isLoading ? "Salvando..." : "Próximo"}
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
                    {flow.step === 0 && <Step0BasicInfo form={orgForm} />}
                    {flow.step === 1 && <Step1Address form={addressForm} />}
                    {flow.step === 2 && Step2Logo({ id: organizationId, name, slug, avatarUrl, logoUrl })}
                    {flow.step === 3 && Step3Avatar({ id: organizationId, name, slug, avatarUrl, logoUrl })}
                  </motion.div>
                </AnimatePresence>
              </FormFlowLayout>
            </FormFlowContext.Provider>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}