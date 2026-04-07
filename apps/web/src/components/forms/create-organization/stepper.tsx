"use client"

import { Check } from "lucide-react"
import clsx from "clsx"

type Step = {
  id: string
  label?: string
  optional?: boolean
}
interface StepperProps {
  steps: Step[]
  currentStep: number // 🔥 index 0-based
  onStepClick?: (stepIndex: number) => void
}

export function Stepper({
  steps,
  currentStep,
  onStepClick
}: StepperProps) {

  return (
    <div className="flex items-center justify-between w-full mb-8">

      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div
            key={step.id}
            className="flex items-center w-full"
          >
            {/* CÍRCULO */}
            <div
              onClick={() => onStepClick?.(index)}
              className={clsx(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all",
                "cursor-pointer",

                // ativo
                isActive && "border-primary bg-primary text-white",

                // completo
                isCompleted && "border-primary bg-primary text-white",

                // futuro
                !isActive && !isCompleted && "border-muted text-muted-foreground"
              )}
            >
              {isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>

            {/* LABEL */}
              <div className="ml-3 hidden sm:flex flex-col">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    index === currentStep && "text-primary",
                    index < currentStep && "text-primary",
                    index > currentStep && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>

                {step.optional && (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground w-fit">
                  {/* <span className="text-xs text-muted-foreground"> */}
                    (Opcional)
                  </span>
                )}
              </div>

            {/* LINHA */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-4 bg-muted">
                <div
                  className={clsx(
                    "h-full transition-all",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
