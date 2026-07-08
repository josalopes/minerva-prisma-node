'use client'

import { useMutation } from '@tanstack/react-query'

import { updateAddressAction } from '@/http/address/actions'
import { UpdateAddressInput } from '@saas/contracts'
import { useOrganizationSlug } from '@/contexts/organization-context'

interface UpdateAddressMutationInput {
  id: number
  data: UpdateAddressInput
}

export function useUpdateAddress() {
  const slug = useOrganizationSlug()

  return useMutation({
    mutationFn: ({ id, data }: UpdateAddressMutationInput) =>
      updateAddressAction({
        slug,
        id,
        data,
      }),
  })
}
