import z from "zod"

export const createAddressFormSchema = z.object({
  type: z.string(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  isPrimary: z.boolean().optional(),
  isNew: z.string().optional(),
})

export type CreateAddressFormData =
  z.infer<typeof createAddressFormSchema>