import { z } from "zod"

export const organizationEntitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  cpfCnpj: z.string(),
  domain: z.string().nullable().optional(),
  personType: z.enum(["FISICA", "JURIDICA"]),
  shouldAttachUserByDomain: z.boolean()
})

export type Organization =
  z.infer<typeof organizationEntitySchema>