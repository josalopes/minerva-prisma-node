"use server"

import { revalidateTag } from "next/cache"

import { ActionResult } from "@/types/action-result"

import { invitesClient } from "@/http/modules/invites/invites.client"

export async function cancelInviteAction(
  id: string
): Promise<ActionResult<void>> {

  try {

    await invitesClient.cancel(id)

    revalidateTag("invites")

    return {
      success: true,
    }

  } catch (error) {

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro inesperado.",
    }

  }

}