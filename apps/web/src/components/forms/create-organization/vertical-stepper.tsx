"use client"

import { Check } from "lucide-react"
import clsx from "clsx"

type Step = {
  id: string
  label: string
  optional?: boolean
}

interface Props {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
}

export function VerticalStepper({
  steps,
  currentStep,
  onStepClick
}: Props) {

  return (
    <div className="flex flex-col gap-4">

      {steps.map((step, index) => {
        const isActive = index === currentStep
        const isCompleted = index < currentStep

        return (
          <div
            key={step.id}
            className="flex items-start gap-3 cursor-pointer"
            onClick={() => onStepClick?.(index)}
          >

            {/* LINHA + CÍRCULO */}
            <div className="flex flex-col items-center">

              {/* CÍRCULO */}
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 text-sm font-medium transition",
                  isActive && "bg-primary border-primary text-white",
                  isCompleted && "bg-primary border-primary text-white",
                  !isActive && !isCompleted && "border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>

              {/* LINHA */}
              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    "w-[2px] h-10 mt-1",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>

            {/* TEXTO */}
            <div className="flex flex-col">

              <span
                className={clsx(
                  "text-sm font-medium",
                  isActive && "text-primary",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.label}
              </span>

              {step.optional && (
                <span className="text-xs text-muted-foreground">
                  Opcional
                </span>
              )}

            </div>
          </div>
        )
      })}
    </div>
  )
}