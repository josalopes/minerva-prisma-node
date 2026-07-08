import { useMutation } from "@tanstack/react-query"

import { resendInviteAction } from "@/actions/invites"

export function useResendInvite() {
  return useMutation({
    mutationFn: resendInviteAction,
  })
}