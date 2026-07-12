'use client'

import { FieldError } from 'react-hook-form'

interface Params {
  value: any
  error?: FieldError | string | null
  isLoading?: boolean
  isDirty?: boolean
}

export function useFieldStatus({
  error,
  isLoading,
  isDirty,
}: Params & { isDirty?: boolean }) {
  const hasError = !!error

  const isValid = !hasError && isDirty

  return {
    hasError,
    // hasValue,
    isValid,
    isLoading,
  }
}
