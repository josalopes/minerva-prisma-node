"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { createOrganizationSchema } from "../../../../../../packages/contracts/organization"
import { createOrganizationAction, updateOrganizationAction } from "@/app/(app)/org/actions";
import { createAddressAction, updateAddressAction } from "@/http/address/actions";
import { Stepper } from "./stepper"
import { usePersistedForm } from "./use-persisted-form"

import { Step1BasicInfo } from "./steps/step-basic-info"
import { Step2Address } from "./steps/step-address"
import { Step3Logo } from "./steps/step-logo"
import { Step4Avatar } from "./steps/step-avatar"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { toast } from "sonner"
import { handleServerActionResult } from "@/lib/show-action-toast"
import { createOrganizationFormSchema } from "@/schemas/create-organization-form"
import { createAddressFormSchema } from "@/schemas/create-address-form"

const steps = [
  "Informações",
  "Endereço",
  "Logo",
  "Avatar"
]

export function CreateOrganizationForm() {
  const [step, setStep] = useState(1)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [slug, setSlug] = useState<string | undefined>(undefined)
  const [isSaving, setIsSaving] = useState(false)
  const [addressId, setAddressId] = useState(0)
  const [isNewAddress, setIsNewAddress] = useState(0)
  const [editAddress, setEditAddress] = useState(0)

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

  function next() {
    setStep((s) => Math.min(s + 1, 4))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 1))
    if (step === 2) {
      setIsNewAddress(0)
      setEditAddress(1)
    }
  }

  async function onSubmit(data: any) {
    console.log(data)
  }

  async function handleNext() {
    if (step === 1) {  
      const isValid = await orgForm.trigger()

      if (!isValid) return

      const values = orgForm.getValues()

      if (!organizationId) {
          setIsSaving(true)

          const result = await createOrganizationAction(values)

          if (!handleServerActionResult(result)) {
            setIsSaving(false)
            return
          }
          
          setOrganizationId(result.data?.id!)
          setSlug(result.data?.slug)
                      
          toast.success("Organização salva com sucesso")

          setStep(2)                
      } else {
          if (slug) {
            setIsSaving(true)
            const result = await updateOrganizationAction({
                ...values,
                slug
            })

            if (!handleServerActionResult(result)) return

            toast.success("Organização atualizada com sucesso")
            setStep(2)
          }
        }
      setIsSaving(false)
      return
    }

    if (step === 2) {
      if (!organizationId) {
        toast.error("Organização não criada")
        return
      }

      const isValid = await addressForm.trigger()
      
      if (!isValid) return

      const values = addressForm.getValues()
      
      if (addressId === 0) {
        setIsSaving(true)

        const { isNew, ...valuesWithoutIsNew } = values

        const result = await createAddressAction({
          ...valuesWithoutIsNew,
          ownerId: organizationId,
          ownerType: "organization",
        })

        if (!handleServerActionResult(result)) {
          setIsSaving(false)
          return
        }
          
        setAddressId(result.data?.id!)

        toast.success("Endereço criado com sucesso")
        setStep(3)
      } else {
        const { isNew, ...valuesWithoutIsNew } = values

        if (values.isNew === 'new') {
          setIsSaving(true)
          const result1 = await createAddressAction({
            ...valuesWithoutIsNew,
            ownerId: organizationId,
            ownerType: "organization",
          })

          if (!handleServerActionResult(result1)) {
            setIsSaving(false)
            return
          }

          toast.success("Endereço criado com sucesso")
          setStep(3)

          setIsSaving(false)
          return
        }

        const result2 = await updateAddressAction({
          ...valuesWithoutIsNew,
          id: addressId
        })

        if (!handleServerActionResult(result2)) {
          setIsSaving(false)
          return
        }

        toast.success("Endereço atualizado com sucesso")
          setStep(3)
      }
      
      setIsSaving(false)
      return
    }

    // if (step === 3) {
    //     await uploadLogo(organizationId!, values.logo)

    //     setStep(4)
    //     return
    // }

  }

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

              {step === 1 && <Step1BasicInfo form={orgForm}/>}
              {step === 2 && <Step2Address form={addressForm}/>}
              {/* {step === 3 && <Step3Logo form={orgForm}/>} */}
              {/* {step === 4 && <Step4Avatar/>} */}

            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-4 mb-4">
            {step > 1 && (
              <Button
                variant="outline"
                type="button"
                onClick={back}
              >
                Voltar
              </Button>
            )}

            {step < 4 && (
              <Button
                type="button"
                onClick={handleNext}
                disabled={isSaving}
              >
                {isSaving ? "Salvando..." : "Próximo"}
              </Button>
            )}

            {step === 4 && (
              <Button type="submit">
                Criar organização
              </Button>
            )}
          </div>
    </div>
  )
}