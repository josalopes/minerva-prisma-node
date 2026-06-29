"use client"

import clsx from "clsx"
import { UseFormReturn } from "react-hook-form"
import { Home, Truck, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import { AppFormField } from "@/components/app-form-field"
import { AsyncField, FormFieldUniversal } from "@/lib/form-field-universal"

import { masks } from "@/utils/input-masks"
import { AddressFormData } from "@/schemas/address-form"

type CepPreview = {
  street: string
  district: string
  complement: string
  city: string
  state: string
  zipCode: string
}

type Props = {
  form: UseFormReturn<AddressFormData>
  cepField: AsyncField

  source?: "cep" | "cnpj" | "manual" | null
  cepPreview?: CepPreview | null
  onUseCep?: () => void
}

export function AddressFields({
  form,
  cepField,
  source,
  cepPreview,
  onUseCep,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Tipo */}
      <div className="col-span-2 space-y-2">
        <Label>Tipo de endereço</Label>

        <ToggleGroup
          type="single"
          value={form.watch("type")}
          onValueChange={(value) => {
            if (value) {
              form.setValue("type", value as any)
            }
          }}
          className="grid grid-cols-3"
        >
          <ToggleGroupItem
            value="GENERAL"
            className="flex gap-2 h-12 border"
          >
            <Home className="w-4 h-4" />
            Geral
          </ToggleGroupItem>

          <ToggleGroupItem
            value="SHIPPING"
            className="flex gap-2 h-12 border"
          >
            <Truck className="w-4 h-4" />
            Entrega
          </ToggleGroupItem>

          <ToggleGroupItem
            value="BILLING"
            className="flex gap-2 h-12 border"
          >
            <Receipt className="w-4 h-4" />
            Cobrança
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Principal */}
      <AppFormField
        control={form.control}
        name="isPrimary"
      >
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
        // action={
        //   <Button
        //     type="button"
        //     disabled={
        //       form
        //         .getValues("zipCode")
        //         ?.replace(/\D/g, "").length !== 8
        //     }
        //     onClick={() => {
        //       const value =
        //         form.getValues("zipCode") ?? ""

        //       const clean =
        //         value.replace(/\D/g, "")

        //       if (clean.length === 8) {
        //         cepField.onBlurAsync(value)
        //       }
        //     }}
        //   >
        //     Buscar
        //   </Button>
        // }
      />

      {source === "cnpj" && (
        <div className="col-span-2 text-xs text-muted-foreground">
          Endereço preenchido automaticamente pelo CNPJ
        </div>
      )}

      {cepPreview && source === "cep" && (
        <div className="rounded-md border p-3 bg-muted/50 text-sm space-y-1">

          <div className="font-medium">
            Endereço encontrado pelo CEP:
          </div>

          <div>{cepPreview.street}</div>
          <div>{cepPreview.district}</div>
          <div>
            {cepPreview.city} - {cepPreview.state}
          </div>

          <button
            type="button"
            className="text-primary text-xs mt-2 underline"
            onClick={onUseCep}
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
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      {/* Número */}
      <AppFormField
        control={form.control}
        name="number"
        label="Número"
      >
        {(field, fieldState) => (
          <Input
            {...field}
            placeholder="Número..."
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      {/* Complemento */}
      <AppFormField
        control={form.control}
        name="complement"
        label="Complemento"
      >
        {(field, fieldState) => (
          <Input
            {...field}
            placeholder="Complemento..."
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      {/* Bairro */}
      <AppFormField
        control={form.control}
        name="district"
        label="Bairro"
      >
        {(field, fieldState) => (
          <Input
            {...field}
            placeholder="Bairro..."
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      {/* Cidade */}
      <AppFormField
        control={form.control}
        name="city"
        label="Cidade"
      >
        {(field, fieldState) => (
          <Input
            {...field}
            placeholder="Cidade..."
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      {/* Estado */}
      <AppFormField
        control={form.control}
        name="state"
        label="Estado"
      >
        {(field, fieldState) => (
          <Input
            {...field}
            placeholder="UF..."
            className={clsx(
              fieldState.error && "field-error",
              !fieldState.error &&
                field.value &&
                "border-success"
            )}
          />
        )}
      </AppFormField>

      
    </div>
  )
}