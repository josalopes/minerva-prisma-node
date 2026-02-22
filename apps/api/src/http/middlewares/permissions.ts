import type { FastifyRequest, FastifyReply } from "fastify";
import { defineAbilityFor } from "@/lib/casl";

export function requirePermission(action: string, subject: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = request.organizationRole;

    const ability = defineAbilityFor(role as any);

    if (!ability.can(action, subject)) {
      return reply.status(403).send({
        message: "Você não tem permissão para esta ação",
      });
    }
  };
}