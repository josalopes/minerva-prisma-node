import { useOrganizationSlug } from '@/contexts/organization-context'
import { deleteAddressAction } from '@/http/address/actions'
import { useMutation } from '@tanstack/react-query'

export function useDeleteAddress() {
  const slug = useOrganizationSlug()

  return useMutation({
    mutationFn: ({ id }: { id: number }) =>
      deleteAddressAction({
        slug,
        id,
      }),
  })
}
