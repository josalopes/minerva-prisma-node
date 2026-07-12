'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { CnpjData } from '@/types/cnpj'
import { api } from '@/http/api-client'
import { useCompanyPreview } from '@/hooks/use-company-preview'
import { useFormFlow } from '@/lib/use-form-flow'
import { CreateOrgContext } from '@/types/create-org-flow'

export type CreateOrgFlow = ReturnType<typeof useFormFlow<CreateOrgContext>>

type Props = {
  flow: CreateOrgFlow
  stepIndex: number
  cnpj: string
  handled: boolean
  preview: ReturnType<typeof useCompanyPreview>
  onApply: (data: CnpjData) => void
}

export function useCnpjLookupFlow({
  flow,
  stepIndex,
  cnpj,
  handled,
  preview,
  onApply,
}: Props) {
  const [data, setData] = useState<CnpjData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lastCnpj = useRef('')
  const debounceRef = useRef<number | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const handledRef = useRef(handled)

  // =========================
  // 🔥 CLEANUP GLOBAL
  // =========================
  const cleanup = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (abortRef.current) {
      abortRef.current.abort()
    }

    requestIdRef.current++
  }, [])

  useEffect(() => {
    handledRef.current = handled
  }, [handled])

  // =========================
  // 🔥 RESET AO SAIR DO STEP
  // =========================
  useEffect(() => {
    if (flow.step !== stepIndex) {
      cleanup()

      setData(null)
      setError(null)
      setIsLoading(false)

      lastCnpj.current = ''
    }
  }, [flow.step, stepIndex, cleanup])

  // =========================
  // 🔥 LOOKUP CONTROLADO
  // =========================
  useEffect(() => {
    if (flow.step !== stepIndex) return
    if (handledRef.current) return

    const clean = cnpj.replace(/\D/g, '')
    if (clean.length !== 14) return

    // 🔥 evita repetir
    if (clean === lastCnpj.current) return

    lastCnpj.current = clean

    cleanup()

    debounceRef.current = window.setTimeout(async () => {
      const controller = new AbortController()
      abortRef.current = controller

      const requestId = ++requestIdRef.current

      setIsLoading(true)
      setError(null)

      try {
        const result = await api
          .get(`cnpj/${clean}`, {
            signal: controller.signal,
          })
          .json<CnpjData>()

        // 🔥 BLOQUEIOS FINAIS (ESSENCIAIS)
        if (requestId !== requestIdRef.current) return
        if (flow.step !== stepIndex) return
        if (handledRef.current) return

        setData(result)
        preview.show(result, onApply)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        if (requestId !== requestIdRef.current) return

        setError(err.message || 'Erro ao consultar CNPJ')
      } finally {
        if (requestId !== requestIdRef.current) return

        setIsLoading(false)
      }
    }, 400) // debounce real
  }, [cnpj, handled, flow.step, cleanup, preview, onApply, stepIndex])

  function reset() {
    cleanup()

    setData(null)
    setError(null)
    setIsLoading(false)

    lastCnpj.current = ''
  }

  // =========================
  // 🔥 CLEANUP AO DESMONTAR
  // =========================
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  return {
    data,
    isLoading,
    error,
    reset,
  }
}
