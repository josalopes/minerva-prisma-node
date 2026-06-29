import { useMutation } from "@tanstack/react-query"

import {
  setPrimaryAddress,
} from "@/services/addresses"

import {
  SetPrimaryAddressInput,
} from "@saas/contracts"

export function useSetPrimaryAddress() {
  return useMutation({
    mutationFn: async (
      data: SetPrimaryAddressInput
    ) => {
      return setPrimaryAddress(data)
    },
  })
}
