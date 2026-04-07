import { FlowStep } from "@/types/form-flow-types"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"
import { loadPersistence, savePersistence } from "./persistence"


export function useFormFlow(
  steps: FlowStep<any, any>[],
  options?: {
    storageKey?: string
  }) {
  const STORAGE_KEY = options?.storageKey ?? "form-flow"
  const [currentStep, setCurrentStep] = useState(0)
  const [contextData, setContextData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const isSubmittingRef = useRef(false)
  const lastCallRef = useRef(0)

  // 🔥 carregar do localStorage

  useEffect(() => {
    const parsed = loadPersistence(STORAGE_KEY)

    if (parsed) {
      setCurrentStep(parsed.step ?? 0)
      setContextData(parsed.context ?? {})
    }
  }, [])

  // 🔥 salvar automaticamente
  useEffect(() => {
    savePersistence(STORAGE_KEY, {
      step: currentStep,
      context: contextData
    })
  }, [currentStep, contextData])

  const context = {
    data: contextData,
    set: (key: string, value: any) => {
      setContextData((prev) => ({ ...prev, [key]: value }))
    },
    get: (key: string) => contextData[key]
  }

  async function next() {
    const now = Date.now()

  // ⛔ debounce (500ms)
    if (now - lastCallRef.current < 500) return

    lastCallRef.current = now
  // 🚫 trava imediata (sincrona)
    if (isSubmittingRef.current) return

    isSubmittingRef.current = true

    const step = steps[currentStep]
    if (!step) {
      isSubmittingRef.current = false
      return
    }

    setIsLoading(true)

    try {
      let values: any = {}
      let response: any = null

      if (step.form) {
        const isValid = await step.form.trigger()

        if (!isValid) {
          isSubmittingRef.current = false
          setIsLoading(false)
          return
        }

        values = step.form.getValues()
      }

      if (step.onSubmit) {
        response = await step.onSubmit(values, context)
      }

      if (step.onSuccess) {
        step.onSuccess(response, context)
      }

      goToNextStep()

    } catch (err: any) {
      toast.error(err?.message ?? "Erro inesperado")
    } finally {
      setIsLoading(false)

      // 🔓 libera o lock
      isSubmittingRef.current = false
    }
  }

  function goToNextStep() {
    setCurrentStep((prev) =>
      Math.min(prev + 1, steps.length - 1)
    )
  }

  function goTo(stepIndex: number) {
    setCurrentStep(stepIndex)
  }

  function skip() {
    if (isSubmittingRef.current) return

    const step = steps[currentStep]

    if (!step?.optional) {
      toast.error("Este passo não pode ser ignorado")
      return
    }

    goToNextStep()
  }

  function back() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY)
    setCurrentStep(0)
    setContextData({})
  }

  return {
    step: currentStep,
    isLoading,
    goTo,
    next,
    back,
    skip,
    reset,
    context,
    steps
  }
}