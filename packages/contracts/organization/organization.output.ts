import z from "zod";

import { organizationEntitySchema } from "./organization.entity";

export const organizationOutputSchema =
  organizationEntitySchema

  export const organizationsListSchema = z.object({
  organizations: z.array(
    organizationEntitySchema
  )
})