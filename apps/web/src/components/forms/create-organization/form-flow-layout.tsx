'use client'

import { ReactNode, useEffect, useState } from 'react'
import { SmartStepper } from './smart-stepper'
import { Check } from 'lucide-react'
import clsx from 'clsx'

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
  saveStatus?: 'idle' | 'saving' | 'saved'
  variant?: 'vertical' | 'horizontal' | 'auto'
  stepErrors?: Record<number, boolean>
  isFinished?: boolean
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
  stepErrors,
  isFinished,
}: FormFlowLayoutProps) {
  const [justCompleted, setJustCompleted] = useState(false)

  const resolvedVariant =
    variant === 'horizontal'
      ? 'horizontal'
      : variant === 'vertical'
        ? 'vertical'
        : 'responsive'

  useEffect(() => {
    if (currentStep > 0) {
      setJustCompleted(true)
      const t = setTimeout(() => setJustCompleted(false), 600)
      return () => clearTimeout(t)
    }
  }, [currentStep])

  // 🔥 STATUS
  // const stepStatus = steps.map((_, index) => {
  //   if (index < currentStep) return "completed"
  //   if (index === currentStep) return "current"
  //   return "pending"
  // })

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* ================= HEADER ================= */}
      <div className="mb-4 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">{header}</span>

            <span className="text-muted-foreground flex items-center gap-2 text-xs">
              {justCompleted && (
                <Check
                  className="animate-in zoom-in text-green-500 duration-200"
                  size={14}
                />
              )}
              Etapa {currentStep + 1} de {steps.length}
            </span>
          </div>

          <span className="text-muted-foreground text-xs">
            {saveStatus === 'saving' && 'Salvando...'}
            {saveStatus === 'saved' && 'Salvo automaticamente'}
          </span>
        </div>

        {/* PROGRESS */}
        <div className="bg-muted h-1 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* ================= LAYOUT ================= */}
      <div
        className={clsx(
          'flex min-h-0 flex-1 gap-4',
          resolvedVariant === 'horizontal' && 'flex-col',
          resolvedVariant === 'vertical' && 'flex-row',
          resolvedVariant === 'responsive' && 'flex-col lg:flex-row',
        )}
      >
        {/* 🔥 STEPPER */}
        <div
          className={clsx(
            'shrink-0',
            resolvedVariant === 'horizontal' && 'w-full',
            resolvedVariant === 'vertical' && 'w-56',
            resolvedVariant === 'responsive' && 'w-full lg:w-56',
          )}
        >
          <SmartStepper
            steps={steps}
            currentStep={currentStep}
            stepErrors={stepErrors}
            onStepClick={onStepClick}
            isFinished={isFinished}
            variant={
              resolvedVariant === 'horizontal'
                ? 'horizontal'
                : resolvedVariant === 'vertical'
                  ? 'vertical'
                  : 'responsive'
            }
          />
        </div>

        {/* 🔥 CONTENT */}
        <div className="mb-2 flex min-h-0 flex-1 flex-col">
          {/* SCROLL */}
          <div
            className="min-h-0 flex-1 overflow-y-auto pr-2"
            data-scroll-container
          >
            <div className="pb-32">{children}</div>
          </div>

          {/* FOOTER */}
          {footer && (
            <div className="bg-background h-28 shrink-0 border-t py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
