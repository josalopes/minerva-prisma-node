import { prisma } from "@/lib/prisma"

export async function resendInviteService(
  id: string,
) {

  const invite =
    await prisma.invite.findUnique({
      where: {
        id,
      },
    })

  if (!invite) {
    throw new Error(
      "Convite não encontrado."
    )
  }

  return invite
}