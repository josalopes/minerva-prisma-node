import { z } from "zod"

export const customerEntitySchema = z.object({
  id: z.string(),
  name: z.string(),
  cpfCnpj: z.string().nullish(),
  code: z.string(),
  organizationId: z.string(),
})

export type Customer =
  z.infer<typeof customerEntitySchema>