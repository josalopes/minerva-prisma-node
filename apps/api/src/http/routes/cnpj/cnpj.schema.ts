import { z } from "zod"

export const cnpjSchema = z.object({
  document: z.string(),
  name: z.string(),
  tradeName: z.string().optional(),
  cnae: z.string().optional(),

  email: z.string().optional(),
  phone: z.string().optional(),

  address: z.object({
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional()
  })
})