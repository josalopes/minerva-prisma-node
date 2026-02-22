type Plan = "FREE" | "PRO" | "ENTERPRISE";

export const planFeatures: Record<Plan, string[]> = {
  FREE: [
    "projects:read",
  ],
  PRO: [
    "projects:read",
    "projects:create",
    "tasks:manage",
  ],
  ENTERPRISE: [
    "projects:read",
    "projects:create",
    "tasks:manage",
    "users:invite",
    "analytics:view",
  ],
};