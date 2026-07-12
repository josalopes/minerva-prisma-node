'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CnpjData } from '@/types/cnpj'
import { api } from '@/http/api-client'

type CompanyData = CnpjData

export function useCnpjLookup() {
  const [data, setData] = useState<CompanyData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const cache = useRef<Map<string, CompanyData>>(new Map())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const lastCnpj = useRef<string>('')
  const activeRequest = useRef<string>('') // 🔥 controle de concorrência
  const isActive = useRef(true)

  useEffect(() => {
    isActive.current = true

    return () => {
      isActive.current = false
    }
  }, [])

  const lookup = useCallback((cnpj: string) => {
    const clean = cnpj.replace(/\D/g, '')

    if (clean.length !== 14) return

    // 🔥 evita repetir a mesma consulta
    if (clean === lastCnpj.current) return

    lastCnpj.current = clean
    activeRequest.current = clean

    // 🔥 debounce
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      // 🔥 cache primeiro
      if (cache.current.has(clean)) {
        setData(cache.current.get(clean)!)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await api.get(`cnpj/${clean}`).json<CompanyData>()

        // 🔥 ignora resposta antiga
        if (activeRequest.current !== clean) return
        if (!isActive.current) return

        cache.current.set(clean, result)
        setData(result)
      } catch (err: any) {
        if (activeRequest.current !== clean) return
        if (!isActive.current) return

        setError(err.message || 'Erro ao consultar CNPJ')
      } finally {
        if (activeRequest.current === clean && isActive.current) {
          setIsLoading(false)
        }
      }
    }, 600)
  }, [])

  // 🔥 reset REAL (importante!)
  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)

    lastCnpj.current = ''
    activeRequest.current = ''

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return {
    data,
    error,
    isLoading,
    lookup,
    reset,
  }
}
