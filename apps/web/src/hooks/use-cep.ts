"use client"

import { useSmartValidator } from "./use-smart-validator"

export function useCep(form: any) {
  const validator = useSmartValidator(async (cep: string) => {
    const clean = cep.replace(/\D/g, "")
    if (clean.length !== 8) return null

    const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
    const data = await res.json()

    if (data.erro) return "CEP não encontrado"

    // 🔥 preenche automaticamente
    form.setValue("street", data.logradouro || "", { shouldDirty: true })
    form.setValue("district", data.bairro || "", { shouldDirty: true })
    form.setValue("city", data.localidade || "", { shouldDirty: true })
    form.setValue("state", data.uf || "", { shouldDirty: true })

    return null
  })

  function onChange(value: string) {
    validator.setError(null) // 🔥 limpa erro ao digitar
    validator.validate(value)
  }

  return {
    onChange,
    error: validator.error,
    isLoading: validator.isLoading
  }
}