import { useMutation } from '@tanstack/react-query'

import { setPrimaryAddress } from '@/services/addresses'

import { SetPrimaryAddressInput } from '@saas/contracts'
import { useOrganizationSlug } from '@/contexts/organization-context'

export function useSetPrimaryAddress() {
  const slug = useOrganizationSlug()

  return useMutation({
    mutationFn: async (data: SetPrimaryAddressInput) => {
      return setPrimaryAddress(slug, data)
    },
  })
}
