"use client"

import { useEffect, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { Home, Truck, Receipt } from "lucide-react"
import clsx from "clsx"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

import { CreateAddressFormData } from "@/schemas/create-address-form"
import { useFocusFirstError } from "@/hooks/use-focus-first-error"
import { AppFormField } from "@/components/app-form-field"

import { masks } from "@/utils/input-masks"
import { useAsyncField } from "@/hooks/use-async-field"
import { FormFieldUniversal } from "@/lib/form-field-universal"
import { useFormFlow } from "@/lib/use-form-flow"
import { CreateOrgContext } from "@/types/create-org-flow"
import { useStepController } from "@/hooks/use-step-controller"
import { autoFill } from "@/utils/auto-fill-form"
import { formatZipCode } from "@/utils/format-zip"

export type CreateOrgFlow = ReturnType<
  typeof useFormFlow<CreateOrgContext>
>
interface Step1AddressProps {
  form: UseFormReturn<CreateAddressFormData>
  flow: CreateOrgFlow
}

export function Step1Address({ 
  form,
  flow
}: Step1AddressProps
) {

  const [isEditable, setIsEditable] = useState(true)
  const [mode, setMode] = useState<string>("new")

  const addressFromCnpj = flow.context.get("addressFromCnpj")
  const source = flow.context.get("addressSource")

  const lastZipRef = useRef("")
  const zipCode = form.watch("zipCode")
  
  const step1 = useStepController<CreateOrgContext, "step1">(flow, "step1")

  const [cepPreview, setCepPreview] = useState<{
    street: string
    district: string
    complement: string
    city: string
    state: string
    zipCode: string
  } | null>(null)

  const cepField = useAsyncField({
    form,
    name: "zipCode",
    validate: async (value) => {
      const clean = value.replace(/\D/g, "")

    if (clean.length !== 8) return "CEP inválido"

    const res = await fetch(`https://viacep.com.br/ws/${clean}/json`)
    const data = await res.json()

    if (data.erro) return "CEP não encontrado"

    flow.context.set("addressSource", "cep")
    setIsEditable(false)

    // 🔥 guarda preview
    setCepPreview({
      street: data.logradouro,
      district: data.bairro,
      complement: data.complemento,
      city: data.localidade,
      state: data.uf,
      zipCode: data.cep
    })

    return null
    }
  })

  function updateStep1(data: Partial<CreateOrgContext["step1"]>) {
    step1.mutate(draft => {
      Object.assign(draft, data)
    })
  }

  useEffect(() => {
    if (!addressFromCnpj) return

    flow.context.set("addressSource", "cnpj")

    autoFill(form, {
      street: addressFromCnpj.street,
      complement: addressFromCnpj.complement,
      district: addressFromCnpj.district,
      city: addressFromCnpj.city,
      state: addressFromCnpj.state,
      zipCode: formatZipCode(addressFromCnpj.zipCode)
    })
        
    lastZipRef.current = addressFromCnpj.zipCode ?? ""

    setIsEditable(false)

    flow.context.set("addressFromCnpj", undefined)
  }, [addressFromCnpj])

  useEffect(() => {
    const saved = flow.context.get("step1").addressMode ?? "new"
    setMode(saved)
  }, [])

  useEffect(() => {
    const clean = zipCode?.replace(/\D/g, "")
    const source = flow.context.get("addressSource")

    if (source === "cnpj") return

    if (!clean || clean.length !== 8) return
    if (clean === lastZipRef.current) return

    lastZipRef.current = clean

    const timeout = setTimeout(() => {
      cepField.onBlurAsync(zipCode)
    }, 500)

    return () => clearTimeout(timeout)
  }, [zipCode])

  useFocusFirstError(form, flow.step)

  return (
    <>
      {/* MODE */}
      <RadioGroup
        className="flex flex-row mb-6"
        value={mode}
        onValueChange={(v) => {
          const value = v as "new" | "edit"
          setMode(value)

          updateStep1({ addressMode: value })
        }}
      >
        <div className="flex items-center gap-3">
          <RadioGroupItem value="new" id="new" />
          <Label htmlFor="new">Novo endereço</Label>
        </div>

        <div className="flex items-center gap-3">
          <RadioGroupItem value="edit" id="edit" />
          <Label htmlFor="edit">Editar atual</Label>
        </div>
      </RadioGroup>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Tipo (mantido com FormField padrão - mais complexo) */}
          <div className="col-span-2 space-y-2">
            <Label>Tipo de endereço</Label>

            <ToggleGroup
              type="single"
              value={form.watch("type")}
              onValueChange={(value) => {
                if (value) form.setValue("type", value as any)
              }}
              className="grid grid-cols-3"
            >
              <ToggleGroupItem value="GENERAL" className="flex gap-2 h-12 border">
                <Home className="w-4 h-4" />
                Geral
              </ToggleGroupItem>

              <ToggleGroupItem value="SHIPPING" className="flex gap-2 h-12 border">
                <Truck className="w-4 h-4" />
                Entrega
              </ToggleGroupItem>

              <ToggleGroupItem value="BILLING" className="flex gap-2 h-12 border">
                <Receipt className="w-4 h-4" />
                Cobrança
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* CEP */}
          <FormFieldUniversal
            control={form.control}
            form={form}
            name="zipCode"
            label="CEP"
            className="col-span-1 md:col-span-2"
            placeholder="00000-000"
            transform={masks.cep}
            asyncField={cepField}
            action={
              <Button 
                  type="button"
                  disabled={form.getValues("zipCode")?.replace(/\D/g, "").length !== 8}
                  onClick={() => {
                    const value = form.getValues("zipCode") ?? ""
                    const clean = value.replace(/\D/g, "")

                    if (clean.length === 8) {
                      cepField.onBlurAsync(value)
                    }
                  }} 
              >
                  Buscar
              </Button>
            }
          />
          {source === "cnpj" && (
            <div className="col-span-2 text-xs text-muted-foreground">
              Endereço preenchido automaticamente pelo CNPJ
            </div>
          )}
          {cepPreview && source === "cep" && (
            <div className="rounded-md border p-3 bg-muted/50 text-sm space-y-1">

              <div className="font-medium text-foreground">
                Endereço encontrado pelo CEP:
              </div>

              <div>{cepPreview.street}</div>
              <div>{cepPreview.district}</div>
              <div>{cepPreview.city} - {cepPreview.state}</div>

              <button
                type="button"
                className="text-primary text-xs mt-2 underline"
                onClick={() => {
                  autoFill(form, {
                    street: cepPreview.street,
                    district: cepPreview.district,
                    city: cepPreview.city,
                    state: cepPreview.state,
                    zipCode: cepPreview,
                  })
                  
                  setCepPreview(null)
                  flow.context.set("addressSource", "manual")
                }}
              >
                Usar este endereço
              </button>
            </div>
          )}
          
          {/* Rua */}
          <AppFormField 
            control={form.control} 
            name="street" 
            label="Rua"
          >
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="Rua..."
                // disabled={!isEditable}
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Número */}
          <AppFormField control={form.control} name="number" label="Número">
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="Número..."
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Complemento */}
          <AppFormField control={form.control} name="complement" label="Complemento">
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="Complemento..."
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Bairro */}
          <AppFormField control={form.control} name="district" label="Bairro">
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="Bairro..."
                // disabled={!isEditable}
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Cidade */}
          <AppFormField control={form.control} name="city" label="Cidade">
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="Cidade..."
                // disabled={!isEditable}
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Estado */}
          <AppFormField control={form.control} name="state" label="Estado">
            {(field, fieldState) => (
              <Input
                {...field}
                placeholder="UF..."
                // disabled={!isEditable}
                className={clsx(
                  fieldState.error && "field-error",
                  !fieldState.error && field.value && "border-success"
                )}
              />
            )}
          </AppFormField>

          {/* Checkbox */}
          <AppFormField control={form.control} name="isPrimary">
            {(field) => (
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />

                <Label>
                  Considerar como endereço principal
                </Label>
              </div>
            )}
          </AppFormField>
        </form>
    </>
  )
}
