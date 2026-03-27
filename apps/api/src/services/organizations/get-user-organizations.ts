import { prisma } from "@/lib/prisma";

export async function getUserOrganizationsService(userId: string) {
  const memberships = await prisma.member.findMany({
    where: { userId },
    select: {
      role: true,
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          avatarUrl: true,
          logoUrl: true,
          personType: true,
          shouldAttachUserByDomain: true,
          domain: true,
          addresses: true,
        },
      },
    },
  });

  const organizationIds = memberships.map(
    (m) => m.organization.id
  );

  const members = await prisma.member.findMany({
    where: {
      organizationId: {
        in: organizationIds,
      },
    },
    select: {
      organizationId: true,
      userId: true,
      email: true,
      role: true,
    },
  });

  const membersByOrg = members.reduce((acc, member) => {
    if (!acc[member.organizationId]) {
      acc[member.organizationId] = [];
    }

    acc[member.organizationId].push({
      userId: member.userId,
      email: member.email,
      role: member.role,
    });

    return acc;
  }, {} as Record<string, any[]>);

  return memberships.map((membership) => {
    const org = membership.organization;

    return {
      ...org,
      role: membership.role,
      members: membersByOrg[org.id] ?? [],
    };
  });
}