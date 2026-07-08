"use client"

import { InviteCard } from "./invite-card"

import { Invite } from "@saas/contracts/invite"
import { InviteSummary } from "./invite-summary"

interface Props {
  invites: Invite[]

  selected?: Invite

  onSelect?(invite: Invite): void

  onResend?(invite: Invite): void

  onDelete?(invite: Invite): void
}

export function InviteList({
  invites,
  selected,
  onSelect,
  onResend,
  onDelete,
}: Props) {

  if (invites.length === 0) {
    return (
      <div
        className="
          flex
          h-40
          items-center
          justify-center
          rounded-lg
          border
          border-dashed
          text-sm
          text-muted-foreground
        "
      >
        Nenhum convite enviado.
      </div>
    )
  }

  const orderedInvites =
  [...invites].sort((a, b) => {

    const order = {
      PENDING: 0,
      EXPIRED: 1,
      ACCEPTED: 2,
      CANCELED: 3,
    }

    return (
      order[a.status] -
      order[b.status]
    )

  })

  return (
    <div className="space-y-6">
       <InviteSummary
          invites={invites}
        />

      <div className="space-y-4">
        {orderedInvites.map((invite) => (
          <InviteCard
            key={invite.id}
            invite={invite}
            selected={
              selected?.id === invite.id
            }
            onClick={onSelect}
            onResend={onResend}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}