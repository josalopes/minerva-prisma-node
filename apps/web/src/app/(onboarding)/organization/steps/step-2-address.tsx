'use client'

import { AddressForm } from '@/components/forms/address-form'

export function Step2Address({ organizationId, onNext, onBack }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Endereço principal
      </h2>

      <AddressForm
        ownerType="organization"
        ownerId={organizationId}
        defaultValues={{
          type: 'BILLING',
          isPrimary: true,
        }}
        onSuccess={onNext}
      />

      <button onClick={onBack}>
        Voltar
      </button>
    </div>
  )
}