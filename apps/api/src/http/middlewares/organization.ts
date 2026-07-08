import type { FastifyInstance } from "fastify";
import { prisma } from "@/lib/prisma";

export async function organizationMiddleware(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    const userId = await request.getCurrentUserId();

    const slug = (request.params as any)?.slug;

    if (!slug) return;

    const membership = await prisma.member.findFirst({
      where: {
        userId,
        organization: {
          slug,
        },
      },
      select: {
        role: true,
        organizationId: true,
      },
    });

    if (!membership) {
      throw new Error("Você não tem acesso a esta organização");
    }

    request.organizationId = membership.organizationId;
    request.organizationRole = membership.role;
  });
}