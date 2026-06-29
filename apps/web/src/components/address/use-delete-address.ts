import { deleteAddress } from "@/services/addresses"
import { useMutation } from "@tanstack/react-query"

export function useDeleteAddress() {
    return useMutation({
      mutationFn: async (id: number) => {
        return deleteAddress(id)
      },
    })
  }