'use client'

import { useRef, useState } from 'react'

export function useSmartValidator<T>(
  fn: (value: T) => Promise<string | null>,
  delay = 400,
) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const cache = useRef(new Map<string, string | null>())
  const timeout = useRef<NodeJS.Timeout | null>(null)

  const lastValueRef = useRef(<string>'')

  const lastValue = ''

  function validate(value: T) {
    if (value !== lastValue) return

    const key = String(value)
    lastValueRef.current = key

    if (cache.current.has(key)) {
      setError(cache.current.get(key)!)
      return
    }

    if (timeout.current) clearTimeout(timeout.current)

    timeout.current = setTimeout(async () => {
      setIsLoading(true)

      try {
        const result = await fn(value)

        if (lastValueRef.current !== key) return
        cache.current.set(key, result)
        setError(result)
      } finally {
        setIsLoading(false)
      }
    }, delay)
  }

  return { validate, error, isLoading, setError }
}
