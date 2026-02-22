import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import type { Actions, Subjects } from "./permissions";
import type { Role } from "./roles";

export type AppAbility = ReturnType<typeof defineAbilityFor>;

interface AbilityParams {
  role: Role;
  userId: string;
  organizationId: string;
}

export function defineAbilityFor({
  role,
  userId,
  organizationId,
}: AbilityParams) {
  const { can, cannot, build } = new AbilityBuilder(
    createMongoAbility
  );

  // ADMIN
  if (role === "ADMIN") {
    can("manage", "all");
  }

  // MANAGER
  if (role === "MANAGER") {
    can("read", "Organization", { id: organizationId });

    can("create", "Project");
    can("read", "Project", { organizationId });
    can("update", "Project", { organizationId });
    can("delete", "Project", { organizationId });
    
    can("create", "Product");
    can("read", "Product", { organizationId });
    can("update", "Product", { organizationId });
    can("delete", "Product", { organizationId });

    can("manage", "Task", { organizationId });
  }

  // MEMBER
  if (role === "MEMBER") {
    can("read", "Organization", { id: organizationId });

    can("read", "Project", { organizationId });

    can("read", "Task", { organizationId });
    can("update", "Task", { assigneeId: userId });
  }

  return build();
}