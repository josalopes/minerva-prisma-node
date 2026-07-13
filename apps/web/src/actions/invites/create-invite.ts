'use server'

import { revalidateTag } from 'next/cache'

// import { ActionResult } from "@/types/action-result"

import {
  createInviteSchema,
  // Invite,
} from '@saas/contracts/invite'

// import { invitesClient } from "@/http/modules/invites/invites.client"

export async function createInviteAction(data: unknown) {
  const result = createInviteSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    // const invite =
    //   await invitesClient.create(
    //     result.data
    //   )

    revalidateTag('invites')

    // return {
    //   success: true,
    //   data: invite,
    // }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado.',
    }
  }
}
