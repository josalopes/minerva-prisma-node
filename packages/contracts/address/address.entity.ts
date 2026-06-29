import { z } from "zod"

export const addressEntitySchema = z.object({
  id: z.int(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  isPrimary: z.boolean(),
  type: z.string(),
  ownerType: z.string(),
  ownerId: z.string(),
})

export type Address =
  z.infer<typeof addressEntitySchema>
