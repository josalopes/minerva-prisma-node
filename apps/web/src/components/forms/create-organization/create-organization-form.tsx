"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createOrganizationAction, updateOrganizationAction } from "@/app/(app)/org/actions";
import { createAddressAction, updateAddressAction } from "@/http/address/actions";
import { Stepper } from "./stepper"
import { usePersistedForm } from "./use-persisted-form"

import { Step0BasicInfo } from "./steps/step-basic-info"
import { Step1Address } from "./steps/step-address"
import { Step2Logo } from "./steps/step-logo"
import { Step3Avatar } from "./steps/step-avatar"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { createOrganizationFormSchema } from "@/schemas/create-organization-form"
import { createAddressFormSchema } from "@/schemas/create-address-form"
import { useFormFlow } from "@/hooks/use-form-flow"

const steps = [
  "Informações",
  "Endereço",
  "Logo",
  "Avatar"
]

interface User {
    id: string;
    name: string | null;
    email: string;
    login: string;
    avatarUrl: string | null;
}

export function CreateOrganizationForm() {
  const [step, setStep] = useState(0)
  const [organizationId, setOrganizationId] = useState<string>("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [name, setName] = useState<string>("")
  const [slug, setSlug] = useState<string>("")
  // const [isSaving, setIsSaving] = useState(false)
  // const [addressId, setAddressId] = useState(0)

  const emptyForm = {
    trigger: async () => true,
    getValues: () => ({})
  }

  const orgForm = useForm({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
    shouldAttachUserByDomain: false
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
    // organization: {
      id: string;
      name: string;
      slug: string;
      avatarUrl: string | null;
      logoUrl: string | null;
    }
    // user: {
    //   id: string;
    //   name: string | null;
    //   avatarUrl: string | null;
    // }
  // }

  let organizationData = null
  

  const flow = useFormFlow([
    {
      id: "organization",
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
      form: addressForm,

      onSubmit: async (values, ctx) => {
        const organizationId = ctx.get("organizationId")
        const addressId = ctx.get("addressId")

        if (!organizationId) {
          throw new Error("Organização não criada")
        }

        const { isNew, ...payload } = values

        // CREATE (primeira vez)
        if (!addressId) {
          const result = await createAddressAction({
            ...payload,
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
        if (isNew === "new") {
          const result = await createAddressAction({
            ...payload,
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
          ...payload,
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
  ])

  return (
    <div className="max-w-xl mx-auto">
      <Stepper steps={steps} currentStep={step} />
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >

              {flow.step === 0 && <Step0BasicInfo form={orgForm}/>}
              {flow.step === 1 && <Step1Address form={addressForm}/>}
              {flow.step === 2 && Step2Logo({id: organizationId, name, slug, avatarUrl, logoUrl})}
              {flow.step === 3 && Step3Avatar({id: organizationId, name, slug, avatarUrl, logoUrl})}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-4 mb-4">
            <Button
              variant="outline"
              type="button"
              onClick={flow.back}
              disabled={flow.step === 0}
            >
              Voltar
            </Button>

            <Button
              type="button"
              onClick={flow.next}
              disabled={flow.isLoading}
            >
              {flow.isLoading ? "Salvando..." : "Próximo"}
            </Button>

            {step === 4 && (
              <Button type="submit">
                Criar organização
              </Button>
            )}
        </div>
    </div>
  )
}