"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { motion } from "framer-motion"

import {
  Form,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import {
  addressFormSchema,
  AddressFormData,
} from "@/schemas/address-form"

import { AddressFields } from "./address-fields"
import { useAddressLookup } from "./use-address-lookup"

import { useCreateAddress } from "@/hooks/use-create-address"
import { useUpdateAddress } from "@/hooks/use-update-address"
import { Address, OwnerType } from "@/types/address"
import { formatZipCode } from "@/utils/format-zip"

type Props = {
  ownerType: OwnerType
  ownerId: string

  address?: Address

  onSuccess?(address: Address): Promise<void> | void
  onCancel?(): void
}

const emptyValues: AddressFormData = {
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  zipCode: "",
  type: "GENERAL",
  isPrimary: false,
}

export function AddressForm({
  ownerId,
  ownerType,
  address,
  onSuccess,
  onCancel,
}: Props) {

  const createMutation =
    useCreateAddress()

  const updateMutation =
    useUpdateAddress()

  const form =
    useForm({
      resolver:
        zodResolver(addressFormSchema),
        defaultValues: emptyValues,
    })

  useEffect(() => {

    if (!address) {
      form.reset(emptyValues)

      return
    }

    form.reset({
      street:
        address.street ?? "",

      number:
        address.number ?? "",

      complement:
        address.complement ?? "",

      district:
        address.district ?? "",

      city:
        address.city ?? "",

      state:
        address.state ?? "",

      zipCode:
        formatZipCode(
          address.zipCode ?? ""
        ),

      type:
        address.type,

      isPrimary:
        address.isPrimary,
    })

  }, [address])

  const {
    cepField,
    cepPreview,
    handleUseCep,
  } = useAddressLookup({
    form,
    autoFillOnLookup: true,
  })

  async function submit(
    values: AddressFormData
  ) {

    try {
      if (address) {
        const result =
          await updateMutation.mutateAsync({
            id: address.id,

            ...values,
          })

        if (!result.success) {
          toast.error(
            result.message ??
            "Erro ao atualizar endereço"
          )

          return
        }

        if (!result.data) {
          return
        }

        toast.success(
          "Endereço atualizado."
        )

        onSuccess?.({
          ...result.data,
          type: result.data.type as Address["type"],
        })

      } else {

        const result =
          await createMutation.mutateAsync({
            ownerType,
            ownerId,
            ...values,
          })

        if (!result.success) {
          toast.error(
            result.message ??
            "Erro ao criar endereço"
          )

          return
        }

        if (!result.data) {
          return
        }

        toast.success(
          "Endereço criado."
        )
        
        onSuccess?.({
          ...result.data,
          type: result.data.type as Address["type"],
        })
      }

    } catch {
      toast.error(
        "Erro inesperado."
      )
    }
  }

  const editing = !!address

  return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Card>    
          <CardHeader>  
            <CardTitle>
              {editing
                ? "Editar endereço"
                : "Novo endereço"}
            </CardTitle>
    
            <CardDescription>
              {editing
                ? "Atualize os dados do endereço selecionado."
                : "Cadastre um novo endereço para esta organização."}
            </CardDescription>    
          </CardHeader>
    
          <CardContent>    
            <Form {...form}>    
              <form
                onSubmit={form.handleSubmit(submit)}
                className="space-y-8"
              >
    
                <AddressFields
                  form={form}
                  cepField={cepField}
                  cepPreview={cepPreview}
                  source="manual"
                  onUseCep={handleUseCep}
                />
    
                <div className="flex justify-end gap-3 border-t pt-6">
    
                  {onCancel && (    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onCancel}
                    >
                      Cancelar
                    </Button>
    
                  )}
    
                  <Button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending
                    }
                  >
    
                    {editing
                      ? "Salvar alterações"
                      : "Adicionar endereço"}    
                  </Button>    
                </div>    
              </form>    
            </Form>    
          </CardContent>    
        </Card>
    </motion.div>
  )
    
}
