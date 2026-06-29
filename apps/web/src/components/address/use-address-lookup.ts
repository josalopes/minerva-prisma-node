"use client"

import { useEffect, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"

import { AddressFormData } from "@/schemas/address-form"

import { autoFill } from "@/utils/auto-fill-form"
import { formatZipCode } from "@/utils/format-zip"
import { useAsyncField } from "@/hooks/use-async-field"

type AddressSource =
  | "manual"
  | "cep"
  | "cnpj"

interface AddressFromCnpj {
  street?: string
  district?: string
  complement?: string
  city?: string
  state?: string
  zipCode?: string
}

interface Props {
  form: UseFormReturn<AddressFormData>
  source?: AddressSource | null
  addressFromCnpj?: AddressFromCnpj
  autoFillOnLookup?: boolean
  onSourceChange?: (
    source: AddressSource
  ) => void

  onAddressFromCnpjConsumed?: () => void
}

export function useAddressLookup({
  form,
  source,
  addressFromCnpj,
  autoFillOnLookup = false,
  onSourceChange,
  onAddressFromCnpjConsumed,
}: Props) {

  const lastZipRef = useRef("")

  const [cepPreview, setCepPreview] =
    useState<{
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

      const clean =
        value.replace(/\D/g, "")

      if (clean.length !== 8) {
        return "CEP inválido"
      }

      const response =
        await fetch(
          `https://viacep.com.br/ws/${clean}/json`
        )

      const data =
        await response.json()

      if (data.erro) {
        return "CEP não encontrado"
      }

      onSourceChange?.("cep")

      if (autoFillOnLookup) {
        autoFill(form, {
          street: data.logradouro,
          district: data.bairro,
          complement: data.complemento,
          city: data.localidade,
          state: data.uf,
          zipCode: data.cep,
        })

        onSourceChange?.("manual")

      } else {
        setCepPreview({
          street: data.logradouro,
          district: data.bairro,
          complement: data.complemento,
          city: data.localidade,
          state: data.uf,
          zipCode: data.cep,
        })
      }

      return null
    },
  })

  useEffect(() => {

    if (!addressFromCnpj) {
      return
    }

    onSourceChange?.("cnpj")

    autoFill(form, {
      street: addressFromCnpj.street,
      complement: addressFromCnpj.complement,
      district: addressFromCnpj.district,
      city: addressFromCnpj.city,
      state: addressFromCnpj.state,
      zipCode: formatZipCode(
        addressFromCnpj.zipCode ?? ""
      ),
    })

    lastZipRef.current =
      addressFromCnpj.zipCode ?? ""

    onAddressFromCnpjConsumed?.()

  }, [addressFromCnpj])

  const zipCode =
    form.watch("zipCode")

  useEffect(() => {

    const clean =
      zipCode?.replace(/\D/g, "")

    if (source === "cnpj") {
      return
    }

    if (!clean || clean.length !== 8) {
      return
    }

    if (clean === lastZipRef.current) {
      return
    }

    lastZipRef.current = clean

    const timeout =
      setTimeout(() => {

        cepField.onBlurAsync(
          zipCode ?? ""
        )

      }, 500)

    return () =>
      clearTimeout(timeout)

  }, [zipCode, source])

  function handleUseCep() {

    if (!cepPreview) {
      return
    }

    autoFill(form, {
      street: cepPreview.street,
      district: cepPreview.district,
      city: cepPreview.city,
      state: cepPreview.state,
      zipCode: cepPreview.zipCode,
      complement: cepPreview.complement,
    })

    setCepPreview(null)

    onSourceChange?.("manual")
  }

  return {
    cepField,
    cepPreview,
    handleUseCep,
  }
}
