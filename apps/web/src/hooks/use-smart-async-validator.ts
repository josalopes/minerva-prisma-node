"use client"

import { useRef, useState } from "react"

type AsyncValidatorReturn = {
  validate: (value: string) => void
  error: string | null
  isLoading: boolean
  setError: (value: string | null) => void
}

export function useSmartAsyncValidator(
  fn: (value: string) => Promise<string | null>,
  delay = 400
): AsyncValidatorReturn {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastValueRef = useRef<string>("")
  const cacheRef = useRef<Map<string, string | null>>(new Map())

  function validate(value: string) {
    if (!value) return

    const key = value.trim()

    // 🔥 evita chamadas repetidas (cache)
    if (cacheRef.current.has(key)) {
      setError(cacheRef.current.get(key)!)
      return
    }

    // 🔥 cancela debounce anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    lastValueRef.current = key

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)

      try {
        const result = await fn(key)

        // 🔥 ignora resposta antiga
        if (lastValueRef.current !== key) return

        cacheRef.current.set(key, result)
        setError(result)
      } finally {
        setIsLoading(false)
      }
    }, delay)
  }

  return {
    validate,
    error,
    isLoading,
    setError
  }
}

// import { useState } from "react"

// type AsyncValidatorReturn = {
//   validate: (value: string) => void
//   error: string | null
//   isLoading: boolean
//   setError: (value: string | null) => void
// }

// export function useSmartAsyncValidator(
//   fn: (value: string) => Promise<string | null>
// ): AsyncValidatorReturn {
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   async function validate(value: string) {
//     setIsLoading(true)

//     try {
//       const result = await fn(value)
//       setError(result)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return {
//     validate,
//     error,
//     isLoading,
//     setError
//   }
// }