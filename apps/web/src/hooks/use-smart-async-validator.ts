'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

type AsyncValidatorReturn = {
  validate: (value: string) => void
  error: string | null
  isLoading: boolean
  setError: (value: string | null) => void
}

export function useSmartAsyncValidator(
  fn: (value: string) => Promise<string | null>,
  delay = 400,
): AsyncValidatorReturn {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastValueRef = useRef('')
  const cacheRef = useRef(new Map<string, string | null>())

  const validate = useCallback(
    (value: string) => {
      if (!value) return

      const key = value.trim()

      // Cache
      if (cacheRef.current.has(key)) {
        setError(cacheRef.current.get(key)!)
        return
      }

      // Cancela debounce anterior
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      lastValueRef.current = key

      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true)

        try {
          const result = await fn(key)

          // Ignora resposta antiga
          if (lastValueRef.current !== key) return

          cacheRef.current.set(key, result)
          setError(result)
        } finally {
          setIsLoading(false)
        }
      }, delay)
    },
    [fn, delay],
  )

  return useMemo(
    () => ({
      validate,
      error,
      isLoading,
      setError,
    }),
    [validate, error, isLoading],
  )
}
