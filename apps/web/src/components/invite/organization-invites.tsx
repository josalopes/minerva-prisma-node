"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Invite } from "@saas/contracts/invite"

import { InviteSummary } from "./invite-summary"
import { InviteList } from "./invite-list"
import { InviteForm } from "./invite-form"

type Props = {
  organizationId: string

  invites: Invite[]
}

export function OrganizationInvites({
  organizationId,
  invites,
}: Props) {

  const router =
    useRouter()

  const [selectedInvite, setSelectedInvite] =
    useState<Invite>()

  async function handleSuccess() {

    setSelectedInvite(undefined)

    router.refresh()
  }

  async function handleResend(
    invite: Invite
  ) {

    toast.info(
      "Reenvio será implementado em seguida."
    )
  }

  async function handleDelete(
    invite: Invite
  ) {

    toast.info(
      "Exclusão será implementada em seguida."
    )
  }

  return (

    <div className="space-y-8">

      <InviteSummary
        invites={invites}
      />

      <InviteList
        invites={invites}

        selected={selectedInvite}

        onSelect={
          setSelectedInvite
        }

        onResend={
          handleResend
        }

        onDelete={
          handleDelete
        }
      />

      <InviteForm
        organizationId={
          organizationId
        }

        onSuccess={
          handleSuccess
        }
      />

    </div>

  )
}