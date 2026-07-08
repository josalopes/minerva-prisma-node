import { z } from "zod";
import { organizationEntitySchema } from "./organization.entity";

export const getOrganizationBySlugResponseSchema = z.object({
  organization: organizationEntitySchema,
});

export type GetOrganizationBySlugResponse = z.infer<
  typeof getOrganizationBySlugResponseSchema
>;
