import { useMutation } from "@tanstack/react-query"

import { cancelInviteAction } from "@/actions/invites"

export function useCancelInvite() {
  return useMutation({
    mutationFn: cancelInviteAction,
  })
}