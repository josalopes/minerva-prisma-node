import { FlowStep, FlowContext } from "@/types/form-flow-types"
import { useEffect, useState, useRef } from "react"
import { toast } from "sonner"

type Options = {
  storageKey?: string
}

export function useFormFlow<TContext = Record<string, any>>(
  steps: FlowStep<any, TContext>[],
  options?: Options
) {
  const STORAGE_KEY = options?.storageKey ?? "form-flow"

  const [currentStep, setCurrentStep] = useState(0)
  const [contextData, setContextData] = useState<TContext>({} as TContext)
  const [isLoading, setIsLoading] = useState(false)

  const [stepErrors, setStepErrors] = useState<Record<number, boolean>>({})
  const isSubmittingRef = useRef(false)
  const lastCallRef = useRef(0)

  // 🔥 carregar do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      const parsed = JSON.parse(saved)
      setCurrentStep(parsed.step ?? 0)
      setContextData(parsed.context ?? {})
    }
  }, [STORAGE_KEY])

  // 🔥 salvar automaticamente
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step: currentStep,
        context: contextData
      })
    )
  }, [currentStep, contextData, STORAGE_KEY])

  const context: FlowContext<TContext> = {
    data: contextData,

    set: (key, value) => {
      setContextData((prev) => ({
        ...prev,
        [key]: value
      }))
    },

    get: (key) => {
      return contextData[key]
    }
  }

  function setStepError(stepIndex: number, hasError: boolean) {
    setStepErrors((prev) => ({
      ...prev,
      [stepIndex]: hasError
    }))
  }

  async function finish() {
    localStorage.removeItem(STORAGE_KEY)
    setCurrentStep(0)
    setContextData({}as TContext)
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
          // setStepError(currentStep, true)
          isSubmittingRef.current = false
          setIsLoading(false)
          return
        }
        
        // setStepError(currentStep, false)

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
    // const step = steps[stepIndex]

    // step?.form?.trigger()
    
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
    setContextData({} as TContext)
  }

  return {
    step: currentStep,
    isLoading,
    goTo,
    next,
    back,
    skip,
    reset,
    finish,
    context,
    steps,
    stepErrors,
    setStepError
  }
}