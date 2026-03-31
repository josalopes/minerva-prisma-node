"use client"

import { UseFormReturn } from "react-hook-form"
import { CreateAddressFormData } from "@/schemas/create-address-form"

import { Home, Truck, Receipt, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState, useRef } from "react"

import { FormCheckbox } from "../../form-checbox"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import {
  ToggleGroup,
  ToggleGroupItem
} from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface Step1AddressProps {
  form: UseFormReturn<CreateAddressFormData>
}

export function Step1Address({ form }: Step1AddressProps) {
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const [checked, setChecked] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined)

  async function fetchCep(cep: string) {
  // 1️⃣ tenta ViaCEP
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
    const data = await res.json()

    if (!data.erro) return data
  } catch {}

  // 2️⃣ fallback (sua API)
  try {
    const res = await fetch(`/api/cep/${cep}`)
    const data = await res.json()

    return data
  } catch {}

  return null
}

  async function handleSearchCep(cepInput?: string) {
    const rawCep = cepInput ?? form.getValues("zipCode")
    const cep = rawCep?.replace(/\D/g, "")

    if (!cep || cep.length !== 8) return

    setIsLoadingCep(true)

    try {
      const data = await fetchCep(cep)

      if (!data) {
        toast.error("CEP não encontrado")
        return
      }

      form.setValue("street", data.logradouro || "")
      form.setValue("district", data.bairro || "")
      form.setValue("city", data.localidade || "")
      form.setValue("state", data.uf || "")

      toast.success("Endereço preenchido automaticamente")

    } catch {
      toast.error("Erro ao buscar CEP")
    } finally {
      setIsLoadingCep(false)
    }
  }

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="isNew"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Novo endereço</FormLabel> */}
              <FormControl>
                <RadioGroup 
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue="new" 
                  className="flex flex-row"
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
              </FormControl>
            </FormItem>
          )}
        />
        {/* Tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="col-span-2">
                <FormLabel>Tipo de endereço</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      type="single"
                      value={field.value}
                      onValueChange={(value) => {
                        if (value) field.onChange(value)
                      }}
                      className="grid grid-cols-3"
                    >
                      <ToggleGroupItem value="GENERAL" className="flex gap-2 h-12 border-1">
                        <Home className="w-4 h-4" />
                        Geral
                      </ToggleGroupItem>

                      <ToggleGroupItem value="SHIPPING" className="flex gap-2 h-12 border-1">
                        <Truck className="w-4 h-4" />
                        Entrega
                      </ToggleGroupItem>

                      <ToggleGroupItem value="BILLING" className="flex gap-2 h-12 border-1">
                        <Receipt className="w-4 h-4" />
                        Cobrança
                      </ToggleGroupItem>
                    </ToggleGroup>
                      {/* <Input placeholder="Ex: SHIPPING" {...field} /> */}
                  </FormControl>
                  <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>CEP</FormLabel>

              <div className="flex gap-2">
                <FormControl>
                  <Input
                    {...field}
                    placeholder="00000-000"
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "")
                      value = value.replace(/^(\d{5})(\d)/, "$1-$2")
                      field.onChange(value)
                    }}
                    onBlur={() => handleSearchCep()}
                  />
                </FormControl>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleSearchCep()}
                  disabled={isLoadingCep}
                >
                  {isLoadingCep ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-1" />
                      Buscar
                    </>
                  )}
                </Button>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />


        {/* Rua */}
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rua</FormLabel>
              <FormControl>
                <Input {...field}
                    placeholder="Rua..."                      
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Número */}
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} 
                    placeholder="Número..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Complemento */}
        <FormField
          control={form.control}
          name="complement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input {...field}
                  placeholder="Complemento..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bairro */}
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} 
                  placeholder="Bairro..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cidade */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} 
                  placeholder="Cidade..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field}
                  placeholder="UF..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPrimary"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />

                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Considerar como endereço principal
                    </FormLabel>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
