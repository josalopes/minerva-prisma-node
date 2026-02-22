'use client'

import { useState } from 'react'
import { Step1Info } from './steps/step-1-info'
import { Step2Address } from './steps/step-2-address'
import { Step3Branding } from './steps/step-3-branding'
import { Step4Members } from './steps/step-4-members'
import { Step5Finish } from './steps/step-5-finish'

export default function OrganizationOnboarding() {
  const [step, setStep] = useState(1)
  const [organizationId, setOrganizationId] = useState<string | null>(null)

  function next() {
    setStep((s) => s + 1)
  }

  function back() {
    setStep((s) => s - 1)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {step === 1 && (
        <Step1Info
          onSuccess={(orgId) => {
            setOrganizationId(orgId)
            next()
          }}
        />
      )}

      {step === 2 && organizationId && (
        <Step2Address
          organizationId={organizationId}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && organizationId && (
        <Step3Branding
          organizationId={organizationId}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && organizationId && (
        <Step4Members
          organizationId={organizationId}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 5 && (
        <Step5Finish />
      )}
    </div>
  )
}