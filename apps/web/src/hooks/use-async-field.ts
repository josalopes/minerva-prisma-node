'use client'

import { useCallback } from 'react'
import { FieldValues, Path, UseFormReturn } from 'react-hook-form'

import { useSmartAsyncValidator } from './use-smart-async-validator'

type Params<T extends FieldValues> = {
  form: UseFormReturn<T>
  name: Path<T>
  validate: (value: string) => Promise<string | null>
}

export function useAsyncField<T extends FieldValues>({
  form,
  name,
  validate,
}: Params<T>) {
  const validator = useSmartAsyncValidator(validate)

  const handleChange = useCallback(() => {
    validator.setError(null)
  }, [validator])

  const handleBlur = useCallback(
    (value: string) => {
      const fieldState = form.getFieldState(name)

      // Só valida async se o Zod já aprovou
      if (!fieldState.error && value) {
        validator.validate(value)
      }
    },
    [form, name, validator],
  )

  return {
    error: validator.error,
    isLoading: validator.isLoading,
    onChangeAsyncClear: handleChange,
    onBlurAsync: handleBlur,
  }
}
