'use client'

import { useMutation } from '@tanstack/react-query'

import { createAddressAction } from '@/http/address/actions'
import { CreateAddressInput } from '@saas/contracts'
import { useOrganizationSlug } from '@/contexts/organization-context'

export function useCreateAddress() {
  const slug = useOrganizationSlug()

  return useMutation({
    mutationFn: (data: CreateAddressInput) =>
      createAddressAction({
        slug,
        data,
      }),
  })
}
