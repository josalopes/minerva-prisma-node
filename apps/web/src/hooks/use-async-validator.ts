"use client"

import { useState } from "react"

export function useAsyncValidator<T>(
  validateFn: (value: T) => Promise<string | null>
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function validate(value: T) {
    if (!value) return

    setIsLoading(true)

    try {
      const result = await validateFn(value)
      setError(result)
    } catch {
      setError("Erro ao validar")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    validate,
    isLoading,
    error
  }
}