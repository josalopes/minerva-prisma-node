'use client'

import { Card } from '@/components/ui/card'

import { Invite } from '@saas/contracts/invite'

type Props = {
  invites: Invite[]
}

export function InviteSummary({ invites }: Props) {
  const total = invites.length

  const pending = invites.filter((i) => i.status === 'PENDING').length

  const accepted = invites.filter((i) => i.status === 'ACCEPTED').length

  const expired = invites.filter((i) => i.status === 'EXPIRED').length

  const canceled = invites.filter((i) => i.status === 'CANCELED').length

  return (
    <Card className="space-y-4 p-5">
      <div>
        <h2 className="text-lg font-semibold">Convites enviados</h2>

        <p className="text-muted-foreground text-sm">
          {total} convite{total !== 1 && 's'}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <span className="text-sm">
            {pending} pendente{pending !== 1 && 's'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-sm">
            {accepted} aceito{accepted !== 1 && 's'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-sm">
            {expired} expirado{expired !== 1 && 's'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-muted-foreground h-2.5 w-2.5 rounded-full" />
          <span className="text-sm">
            {canceled} cancelado{canceled !== 1 && 's'}
          </span>
        </div>
      </div>
    </Card>
  )
}
