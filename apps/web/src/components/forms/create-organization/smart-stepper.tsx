"use client"

import { Check } from "lucide-react"
import clsx from "clsx"

type Step = {
  id: string
  label: string
  optional?: boolean
}

interface SmartStepperProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void

  /**
   * vertical → sempre vertical
   * horizontal → sempre horizontal
   * responsive → mobile horizontal / desktop vertical
   */
  variant?: "vertical" | "horizontal" | "responsive"
}

export function SmartStepper({
  steps,
  currentStep,
  onStepClick,
  variant = "responsive"
}: SmartStepperProps) {

  // ===============================
  // 🔥 STATUS
  // ===============================
  const getStatus = (index: number) => {
    if (index < currentStep) return "completed"
    if (index === currentStep) return "current"
    return "pending"
  }

  // ===============================
  // 🔥 LAYOUT CLASSES
  // ===============================
  const containerClass = clsx(
    "flex",

    // vertical fixo
    variant === "vertical" && "flex-col gap-6",

    // horizontal fixo
    variant === "horizontal" && "flex-row items-center gap-4",

    // 🔥 RESPONSIVO
    variant === "responsive" &&
      "flex-row items-center gap-4 lg:flex-col lg:items-start lg:gap-6"
  )

  return (
    <div className={containerClass}>

      {steps.map((step, index) => {
        const status = getStatus(index)
        const isCompleted = status === "completed"
        const isCurrent = status === "current"

        return (
          <div
            key={step.id}
            onClick={() => onStepClick?.(index)}
            className={clsx(
              "flex cursor-pointer transition-all hover:opacity-80",
              
              // 🔥 layout interno adaptativo
              variant === "vertical" && "items-start gap-3",
              variant === "horizontal" && "items-center gap-2",
              variant === "responsive" &&
                "items-center gap-2 lg:items-start lg:gap-3"
            )}
          >

            {/* ================= CIRCLE + LINE ================= */}
            <div className="flex flex-col items-center">

              {/* 🔵 CIRCLE */}
              <div
                className={clsx(
                  "flex items-center justify-center rounded-full border text-sm font-medium transition-all duration-300",

                  // tamanhos
                  "w-8 h-8",

                  isCompleted && "bg-primary text-white border-primary",
                  isCurrent && "border-primary text-primary",
                  !isCompleted && !isCurrent && "border-border text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="animate-in zoom-in duration-200" size={16} />
                ) : (
                  index + 1
                )}
              </div>

              {/* 🔥 LINHA VERTICAL (desktop) */}
              {variant !== "horizontal" && index < steps.length - 1 && (
                <div className="hidden lg:block w-px h-10 bg-border mt-2" />
              )}

            </div>

            {/* ================= LABEL ================= */}
            <div className="flex flex-col">

              <span
                className={clsx(
                  "text-sm font-medium",
                  isCurrent && "text-primary",
                  isCompleted && "text-foreground",
                  !isCompleted && !isCurrent && "text-muted-foreground"
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

            {/* 🔥 LINHA HORIZONTAL (mobile) */}
            {variant !== "vertical" && index < steps.length - 1 && (
              <div
                className={clsx(
                  "h-[2px] w-8 lg:hidden transition-colors",
                  index < currentStep ? "bg-primary" : "bg-border"
                )}
              />
            )}

          </div>
        )
      })}
    </div>
  )
}

