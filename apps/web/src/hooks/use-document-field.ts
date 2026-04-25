"use client"

import { useEffect, useRef, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { useAsyncField } from "./use-async-field"
import { isValidCPF, isValidCNPJ } from "@/utils/cpf-cnpj-utils"
import { CreateOrganizationFormData } from "@/schemas/create-organization-form"
import { useCnpjLookup } from "./use-cnpj-lookup"

export function useDocumentField({ 
  form,
}: {
  form: UseFormReturn<CreateOrganizationFormData> 
}) {
  const [company, setCompany] = useState<any>(null)
  const rawValue = form.watch("cpfCnpj")
  const personType = form.watch("personType")

  const lastValidated = useRef("")

  const value =
    typeof rawValue === "string"
        ? rawValue
    : ""

  const docType = personType === "FISICA" ? "CPF" : "CNPJ"

  // =========================
  // 🧠 detectar tipo
  // =========================
  const clean = value?.replace(/\D/g, "") || ""

  

  // =========================
  // 🎨 máscara dinâmica
  // =========================
  function transform(value: string) {
    let digits = value.replace(/\D/g, "")

    const max = docType === "CPF" ? 11 : 14
    digits = digits.slice(0, max)

    if (docType === "CPF") {
      digits = digits.replace(/^(\d{3})(\d)/, "$1.$2")
      digits = digits.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      digits = digits.replace(/\.(\d{3})(\d)/, ".$1-$2")
      return digits
    }

    digits = digits.replace(/^(\d{2})(\d)/, "$1.$2")
    digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    digits = digits.replace(/\.(\d{3})(\d)/, ".$1/$2")
    digits = digits.replace(/(\d{4})(\d)/, "$1-$2")

    return digits
  }

  // =========================
  // 🌐 validação async (CNPJ)
  // =========================
  const cnpjLookup = useCnpjLookup()

  useEffect(() => {
    const clean = value.replace(/\D/g, "")

    if (docType === "CNPJ" && clean.length === 14) {
      cnpjLookup.lookup(value)
    }
  }, [value, docType])

  // =========================
  // 🧠 label dinâmica
  // =========================
  const label = docType === "CPF" ? "CPF" : "CNPJ"

  return {
    label,
    transform,
    docType,
    value,
    company: cnpjLookup.data,
    isLoading: cnpjLookup.isLoading,
    error: cnpjLookup.error
  }
}