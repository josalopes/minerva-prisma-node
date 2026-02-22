import { defineAbilityFor } from "./ability";
import { getMembership } from "@/services/members/get-membership";
import { Role } from "./roles";

export async function getUserAbility(userId: string, organizationId: string) {
  const membership = await getMembership(userId, organizationId);

  if (!membership) {
    throw new Error("Usuário não pertence a esta Organização");
  }

  return defineAbilityFor({
    role: membership.role as Role,
    userId,
    organizationId,
  });
}