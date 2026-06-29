import z from "zod"

export const addressTypeSchema = z.enum([
  "GENERAL",
  "BILLING",
  "SHIPPING",
])

export const addressFormSchema = z.object({
  street: z.string().optional(),
  number: z.string().optional(),

  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  type: z.enum([
    "GENERAL",
    "BILLING",
    "SHIPPING",
  ]),

  isPrimary: z.boolean(),
})

export type AddressFormData =
  z.infer<typeof addressFormSchema>