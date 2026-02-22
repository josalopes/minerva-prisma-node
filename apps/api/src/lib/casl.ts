import { AbilityBuilder, createMongoAbility } from "@casl/ability";
import { Role } from "@prisma/client";

export function defineAbilityFor(role: Role) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (role === "ADMIN") {
    can("manage", "all");
  }

  if (role === "MEMBER") {
    can("read", "Organization");
    can("read", "Project");
    can("read", "Product");
    cannot("delete", "Project");
  }

  if (role === "BILLING") {
    can("read", "Organization");
    can("manage", "Transaction");
    can("read", "Customer");
  }

  return build();
}