import z from "zod"

import { organizationEntitySchema } from "./organization.entity"
import { createOrganizationSchema, updateOrganizationSchema } from "./organization.input"

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>

export type UpdateOrganizationInput =
  z.infer<typeof updateOrganizationSchema>

export type Organization =
  z.infer<typeof organizationEntitySchema>