import { useMutation } from "@tanstack/react-query"
import { createTransactionAction } from "./actions"

export function useCreateTransaction() {
  return useMutation({
    mutationFn: createTransactionAction
  })
}