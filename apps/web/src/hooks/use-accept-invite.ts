import { useMutation } from "@tanstack/react-query"

import { acceptInviteAction } from "@/actions/invites"

export function useAcceptInvite() {
  return useMutation({
    mutationFn: acceptInviteAction,
  })
}