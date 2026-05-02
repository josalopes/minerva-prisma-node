"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FormProvider, useForm, UseFormReturn } from "react-hook-form"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import { createOrganizationAction, updateOrganizationAction } from "@/app/(app)/org/actions";
import { createAddressAction, updateAddressAction } from "@/http/address/actions";

import { Step0BasicInfo } from "./steps/step-basic-info"
import { Step1Address } from "./steps/step-address"
import { Step2Logo } from "./steps/step-logo"
import { Step3Avatar } from "./steps/step-avatar"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import { CreateOrganizationFormData } from "@/schemas/create-organization-form"
import { CreateAddressFormData } from "@/schemas/create-address-form"
import { useFormFlow } from "@/lib/use-form-flow"
import { useAutoSaveStatus } from "@/lib/autosave-status"
import { useScrollOnStep } from "@/lib/scroll"
import { mergeContextStep } from "@/lib/flow-helpers"
import { FormFlowLayout } from "./form-flow-layout"
import { FlowStep } from "@/types/form-flow-types"
import { CreateOrgContext } from "@/types/create-org-flow"
import { useCompanyPreview } from "@/hooks/use-company-preview"
import { CompanyPreviewModal } from "./company-preview-modal"
import { updateOrganizationLogo } from "@/http/organizations/update-organization-logo"
import { updateOrganizationAvatar } from "@/http/organizations/update-organization-avatar"

export function CreateOrganizationForm() {
  const preview = useCompanyPreview()

  const beforeNextHandlers: Record<number, (() => Promise<void>) | undefined> = {
    2: handleLogoStep,
    3: handleAvatarStep
  }

  const saveHandlers: Record<number, (() => Promise<void>) | undefined> = {
    0: async () => nextWithSave("step1", orgForm),
    1: async () => nextWithSave("step2", addressForm)
  }

  const router = useRouter()

  const orgForm = useForm<CreateOrganizationFormData>({
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

  const addressForm = useForm<CreateAddressFormData>({
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

  type cloudinaryProps = {
    imageUrl: string;
    publicId: string;
  }

  async function handleLogoStep() {
    const step3 = flow.context.get("step3")

    if (step3?.logoUrl) {
      await flow.next()
      return
    }

    const orgId = flow.context.get("step1")?.organizationId
    const slug = flow.context.get("step1")?.slug
    
    const file = step3?.file

    if (!file || !orgId) {
      await flow.next()
      return
    }

    const newFilename = `${orgId}-logo`;
    const newFile = new File([file], newFilename, { type: file.type })

    const type = "logo"
    
    const cloudinary = await uploadToCloudinary(newFile, orgId, type)
    const urlImage = cloudinary.secure_url
    const publicId = cloudinary.public_id

    if (!urlImage || urlImage === "") {
      toast.error("Falha no upload da imagem");
      return;
    }

    await updateOrganizationLogo({ logoUrl: urlImage, logoPublicId: publicId, slug })

    mergeContextStep(flow.context, "step3", {
      logoUrl: urlImage
    })

    await flow.next()
  }

  async function handleAvatarStep() {
    const step4 = flow.context.get("step4")

    if (step4?.avatarUrl) {
      await flow.next()
      return
    }

    const orgId = flow.context.get("step1")?.organizationId
    const slug = flow.context.get("step1")?.slug
    
    const file = step4?.file

    if (!file || !orgId) {
      await flow.next()
      return
    }

    const newFilename = `${orgId}-avatar`;
    const newFile = new File([file], newFilename, { type: file.type })

    const type = "avatar"

    const cloudinary = await uploadToCloudinary(newFile, orgId, type)
    const urlImage = cloudinary.secure_url
    const publicId = cloudinary.public_id

    if (!urlImage || urlImage === "") {
      toast.error("Falha no upload da imagem");
      return;
    }

    await updateOrganizationAvatar({ avatarUrl: urlImage, avatarPublicId: publicId, slug })

    mergeContextStep(flow.context, "step4", {
      avatarUrl: urlImage
    })

    await flow.next()
  }

  // =========================
  // 🔥 UPLOAD CLOUDINARY
  // =========================
  async function uploadToCloudinary(file: File, orgId: string, type: string): Promise<any | undefined> {
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("organizationId", orgId)
      formData.append("type", type)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/image/upload`,
        {
          method: "POST",
          body: formData
        }
      )

      const data = await res.json();

      if (!res.ok) {
        toast("Falha no upload da imagem!")
        return undefined;
      }

      toast("Imagem alterada com sucesso!")
      
      return data  
    } catch (error) {
      return undefined
    }    
  }

  async function deleteFromCloudinary(publicId: string) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/image/upload`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          public_id: publicId
        })
      }
    )
  }

  function nextWithSave<K extends keyof CreateOrgContext>(
    key: K,
    form: UseFormReturn<any>
  ) {
    const prev = flow.context.get(key) || {}

    flow.context.set(key, {
      ...prev,
      ...form.getValues()
    })

    return flow.next()
  }

  const steps: FlowStep<any, CreateOrgContext>[] = [
    {          
      id: "organization",
      label: "Informações",
      form: orgForm,

      onSubmit: async (values) => {
        const organizationId = flow.context.get("step1")?.organizationId
        const slug = flow.context.get("step1")?.slug

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

      onSuccess: (res) => {
        if (res.type === "create") {
          flow.context.set("step1", {
            "organizationId": res.data.id,
            "slug": res.data.slug,
            "addressMode": "new"
          })
          // setName(res.data.name)
          // setAvatarUrl(res.data.avatarUrl)
          // setLogoUrl(res.data.logoUrl)

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

      onSubmit: async (values) => {
        const organizationId = flow.context.get("step1")?.organizationId
        const addressId = flow.context.get("step1")?.addressId
        const mode = flow.context.get("step1")?.addressMode

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

      onSuccess: (res) => {
        if (res.type === "create" || res.type === "create-new") {
          mergeContextStep(flow.context, "step1", {
            addressId: res.data.id
          })

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
    },

    {
      id: "avatar",
      label: "Avatar",
      optional: true,
    }    
  ]
  

  const flow = useFormFlow<CreateOrgContext>(steps, { 
    storageKey: "create-form-flow"
  })

  const slug = flow.context.get("step1")?.slug

  useScrollOnStep(flow.step)

  const saveStatus = useAutoSaveStatus({
    step: flow.step,
    context: flow.context.data
  })

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="mt-4 mx-auto w-full max-w-xl md:max-w-2xl lg:max-w-5xl flex-1 min-h-0 flex flex-col">
        <Card className="flex-1 min-h-0 flex flex-col shadow-sm border bg-background backdrop-blur">
          <CardContent className="flex-1 min-h-0 p-8">
              <FormFlowLayout
                steps={flow.steps}
                currentStep={flow.step} 
                stepErrors={flow.stepErrors}
                isFinished={flow.isFinished}               
                variant="auto"
                onStepClick={(index) => {
                  if (index <= flow.step || flow.stepErrors[index]) {
                    flow.goTo(index)
                  }
                }}

                header={
                  <div className="flex items-center justify-between w-full">
                    <span>Criar Organização</span>
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
                      <Button className="transition-all active:scale-95"
                        type="button"
                        onClick={async () => {
                          const beforeHandler = beforeNextHandlers[flow.step]

                          if (beforeHandler) {
                            await beforeHandler()
                            return
                          }

                          const saveHandler = saveHandlers[flow.step]

                          if (saveHandler) {
                            await saveHandler()
                            return
                          }

                          await flow.next()
                        }}
                        disabled={flow.isLoading}
                      >
                        {flow.step === flow.steps.length - 1 ? "Salvar" : "Próximo"}
                      </Button>

                      <Button
                        disabled={!slug}
                        onClick={async () => {                          
                          if (slug) {
                            toast.success("Cadastro concluído")
                            await flow.finish()
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
                          // preview={preview}
                        />
                      </FormProvider>
                    )}

                    {flow.step === 2 && (
                      <Step2Logo
                        flow={flow}
                      />
                    )}

                    {flow.step === 3 && (
                      <Step3Avatar
                        flow={flow}
                      />
                    )}
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