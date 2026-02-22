import { prisma } from "@/lib/prisma";

export async function getMembership(
  userId: string,
  organizationId: string
) {
  const membership = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
    },
    select: {
      id: true,
      role: true,
      organizationId: true,
      userId: true,
    },
  });

  return membership;
}