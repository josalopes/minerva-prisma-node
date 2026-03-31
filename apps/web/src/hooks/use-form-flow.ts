import { FlowStep } from "@/types/form-flow-types"
import { useState } from "react"
import { toast } from "sonner"

export function useFormFlow(steps: FlowStep<any, any>[]) {
  const [currentStep, setCurrentStep] = useState(0)
  const [contextData, setContextData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const context = {
    data: contextData,
    set: (key: string, value: any) => {
      setContextData((prev) => ({ ...prev, [key]: value }))
    },
    get: (key: string) => contextData[key]
  }

  async function next() {
    const step = steps[currentStep]
    if (!step) return

    setIsLoading(true)

    try {
      let values: any = {}
      let response: any = null

      // 🧠 validação só se tiver form
      if (step.form) {
        const isValid = await step.form.trigger()
        if (!isValid) {
          setIsLoading(false)
          return
        }

        values = step.form.getValues()
      }

      // 🧠 submit só se existir
      if (step.onSubmit) {
        response = await step.onSubmit(values, context)
      }

      // 🧠 success opcional
      if (step.onSuccess) {
        step.onSuccess(response, context)
      }

      // 🚀 avança sempre
      setCurrentStep((prev) =>
        Math.min(prev + 1, steps.length - 1)
      )

    } catch (err: any) {
      toast.error(err?.message ?? "Erro inesperado")
    } finally {
      setIsLoading(false)
    }
  }

  function back() {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  return {
    step: currentStep,
    isLoading,
    next,
    back,
    context
  }
}
// import { useState } from "react"
// import { toast } from "sonner"

// export function useFormFlow(steps: FlowStep<any, any>[]) {
//   const [currentStep, setCurrentStep] = useState(0)
//   const [contextData, setContextData] = useState<Record<string, any>>({})
//   const [isLoading, setIsLoading] = useState(false)

//   const context = {
//     data: contextData,
//     set: (key: string, value: any) => {
//       setContextData((prev) => ({ ...prev, [key]: value }))
//     },
//     get: (key: string) => contextData[key]
//   }

//   async function next() {
//     const step = steps[currentStep]

//     if (!step) return

//     // validação
//     const isValid = await step.form.trigger()
//     if (!isValid) return

//     setIsLoading(true)

//     try {
//       let response = null

//       if (step.onSubmit) {
//         response = await step.onSubmit(
//           step.form.getValues(),
//           context
//         )
//       }

//       if (step.onSuccess) {
//         step.onSuccess(response, context)
//       }

//       setCurrentStep((prev) =>
//         Math.min(prev + 1, steps.length - 1)
//       )

//     } catch (err: any) {
//       toast.error(err?.message ?? "Erro inesperado")
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   function back() {
//     setCurrentStep((prev) => Math.max(prev - 1, 0))
//   }

//   return {
//     step: currentStep,
//     isLoading,
//     next,
//     back,
//     context
//   }
// }