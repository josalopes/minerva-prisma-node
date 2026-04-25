"use client"

import { UseFormReturn, FieldValues, Path } from "react-hook-form"
import { useSmartAsyncValidator } from "./use-smart-async-validator"

type Params<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  validate: (value: string) => Promise<string | null>
}

export function useAsyncField<T extends FieldValues>({
  form,
  name,
  validate
}: Params<T>) {
  const validator = useSmartAsyncValidator(validate)

  function handleChange(value: string) {
    // 🔥 limpa erro async ao digitar
    validator.setError(null)
  }

  function handleBlur(value: string) {
    const fieldState = form.getFieldState(name)

    // 🔥 só valida async se já estiver válido no Zod
    if (!fieldState.error && value) {
      validator.validate(value)
    }
  }

  return {
    error: validator.error,
    isLoading: validator.isLoading,
    onChangeAsyncClear: handleChange,
    onBlurAsync: handleBlur
  }
}