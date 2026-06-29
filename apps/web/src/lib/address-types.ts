import { z } from "zod"

export const addressTypeSchema = z.enum([
  "GENERAL",
  "BILLING",
  "SHIPPING",
])

export type AddressType = z.infer<typeof addressTypeSchema>