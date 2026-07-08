import { useMutation } from "@tanstack/react-query"

import { createInviteAction } from "@/actions/invites"

export function useCreateInvite() {
  return useMutation({
    mutationFn: createInviteAction,
  })
}