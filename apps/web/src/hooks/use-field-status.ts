"use client"

import { FieldError } from "react-hook-form"

interface Params {
  value: any
  error?: FieldError | string | null
  isLoading?: boolean
  isDirty?: boolean
}

export function useFieldStatus({
  value,
  error,
  isLoading,
  isDirty
}: Params & { isDirty?: boolean }) {
  const hasError = !!error

  const hasValue =
    value !== undefined &&
    value !== null &&
    value !== ""

  const isValid =
    !hasError &&
    isDirty

  return {
    hasError,
    // hasValue,
    isValid,
    isLoading
  }
}