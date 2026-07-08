'use client'

import { useMutation } from '@tanstack/react-query'

import { setPrimaryAddressAction } from '@/http/address/actions'
import { SetPrimaryAddressInput } from '@saas/contracts'
import { useOrganizationSlug } from '@/contexts/organization-context'

export function useSetPrimaryAddress() {
  const slug = useOrganizationSlug()

  return useMutation({
    mutationFn: async (payload: SetPrimaryAddressInput) =>
      setPrimaryAddressAction({
        slug,
        payload,
      }),
  })
}
