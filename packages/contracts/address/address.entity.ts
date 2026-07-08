import { z } from "zod"

export const addressTypes = [
  "GENERAL",
  "BILLING",
  "SHIPPING",
] as const

export const addressTypeSchema =
  z.enum(addressTypes)

export type AddressType =
  z.infer<typeof addressTypeSchema>

export const addressOwnerTypes = [
  "ORGANIZATION",
  "CUSTOMER",
  "MEMBER",
] as const

export const addressOwnerTypeSchema =
  z.enum(addressOwnerTypes)

export type AddressOwnerType =
  z.infer<typeof addressOwnerTypeSchema>

export const addressEntitySchema = z.object({
  id: z.int(),
  street: z.string().nullish(),
  number: z.string().nullish(),
  complement: z.string().nullish(),
  district: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zipCode: z.string().nullish(),
  country: z.string().nullish(),
  isPrimary: z.boolean(),
  type: addressTypeSchema,
  ownerType: addressOwnerTypeSchema,
  ownerId: z.string(),
})

export type Address =
  z.infer<typeof addressEntitySchema>
