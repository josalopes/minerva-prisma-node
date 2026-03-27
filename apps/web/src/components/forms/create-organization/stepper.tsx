// stepper.tsx
"use client"

import { Check } from "lucide-react"

export function Stepper({
  steps,
  currentStep
}: {
  steps: string[]
  currentStep: number
}) {

  return (
    <div className="flex items-center justify-between mb-10">

      {steps.map((label, index) => {

        const step = index + 1
        const active = step === currentStep
        const completed = step < currentStep

        return (
          <div
            key={label}
            className="flex-1 flex items-center"
          >

            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border
              ${completed && "bg-primary text-white"}
              ${active && "border-primary"}
              `}
            >
              {completed ? <Check size={16}/> : step}
            </div>

            <span className="ml-3 text-sm">
              {label}
            </span>

          </div>
        )
      })}

    </div>
  )
}