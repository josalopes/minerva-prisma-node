'use server'

import { revalidateTag } from 'next/cache'

import { ActionResult } from '@/types/action-result'

import { acceptInviteSchema } from '../../../../../packages/contracts/invite'

// import { invitesClient } from "@/http/modules/invites/invites.client"

export async function acceptInviteAction(
  data: unknown,
): Promise<ActionResult<void>> {
  const result = acceptInviteSchema.safeParse(data)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  try {
    // await invitesClient.accept(
    //   result.data
    // )

    revalidateTag('invites')

    revalidateTag('members')

    return {
      success: true,
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Erro inesperado.',
    }
  }
}
