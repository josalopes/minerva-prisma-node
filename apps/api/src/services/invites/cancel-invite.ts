import { prisma } from "@/lib/prisma"

export async function cancelInviteService(
  id: string,
) {

  return prisma.invite.update({

    where: {
      id,
    },

    data: {
      status: "CANCELED",
    },

  })
}