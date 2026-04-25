"use client"

import { ReactNode, useEffect, useState } from "react"
import { SmartStepper } from "./smart-stepper"
import { Check } from "lucide-react"
import clsx from "clsx"

type Step = {
  id: string
  label: string
  optional?: boolean
}

interface FormFlowLayoutProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (index: number) => void
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
  saveStatus?: "idle" | "saving" | "saved"
  variant?: "vertical" | "horizontal" | "auto"
  stepErrors?: Record<number, boolean>
}

export function FormFlowLayout({
  steps,
  currentStep,
  onStepClick,
  header,
  footer,
  children,
  saveStatus,
  variant,
  stepErrors
}: FormFlowLayoutProps) {

  const [justCompleted, setJustCompleted] = useState(false)

  const resolvedVariant =
    variant === "horizontal"
      ? "horizontal"
      : variant === "vertical"
      ? "vertical"
      : "responsive"

  useEffect(() => {
    if (currentStep > 0) {
      setJustCompleted(true)
      const t = setTimeout(() => setJustCompleted(false), 600)
      return () => clearTimeout(t)
    }
  }, [currentStep])

  // 🔥 STATUS
  const stepStatus = steps.map((_, index) => {
    if (index < currentStep) return "completed"
    if (index === currentStep) return "current"
    return "pending"
  })

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ================= HEADER ================= */}
      <div className="shrink-0 mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {header}
            </span>

            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              {justCompleted && (
                <Check className="text-green-500 animate-in zoom-in duration-200" size={14} />
              )}
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>

          <span className="text-xs text-muted-foreground">
            {saveStatus === "saving" && "Salvando..."}
            {saveStatus === "saved" && "Salvo automaticamente"}
          </span>
        </div>

        {/* PROGRESS */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* ================= LAYOUT ================= */}
      <div
        className={clsx(
          "flex-1 min-h-0 flex gap-4",
          resolvedVariant === "horizontal" && "flex-col",
          resolvedVariant === "vertical" && "flex-row",
          resolvedVariant === "responsive" && "flex-col lg:flex-row"
        )}
      >

        {/* 🔥 STEPPER */}
        <div
          className={clsx(
            "shrink-0",
            resolvedVariant === "horizontal" && "w-full",
            resolvedVariant === "vertical" && "w-56",
            resolvedVariant === "responsive" && "w-full lg:w-56"
          )}
        >
          <SmartStepper
            steps={steps}
            currentStep={currentStep}
            stepErrors={stepErrors}                       
            onStepClick={onStepClick}
            variant={
              resolvedVariant === "horizontal"
                ? "horizontal"
                : resolvedVariant === "vertical"
                ? "vertical"
                : "responsive"
            }
          />
        </div>

        {/* 🔥 CONTENT */}
        <div className="flex-1 min-h-0 flex flex-col mb-2">

          {/* SCROLL */}
          <div
            className="flex-1 overflow-y-auto min-h-0 pr-2"
            data-scroll-container
          >
            <div className="pb-32">
              {children}
            </div>
          </div>

          {/* FOOTER */}
          {footer && (
            <div className="shrink-0 h-28 border-t bg-background py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
