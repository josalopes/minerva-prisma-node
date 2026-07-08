import { prisma } from "@/lib/prisma"

export async function getInvitesService(
  organizationId: string,
) {

  return prisma.invite.findMany({

    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },

  })
}