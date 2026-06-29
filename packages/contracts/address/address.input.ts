import z from "zod";

export const typeAddressSchema = z.union([
    z.literal('GENERAL'),
    z.literal('BILLING'),
    z.literal('SHIPPING'),
])



export type typeAddress = z.infer<typeof typeAddressSchema>


export const baseAddressSchema = z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    district: z.string().optional(),        
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    type: typeAddressSchema,
    isPrimary: z.coerce.boolean().default(false),
    ownerType: z.enum(["organization", "member"]),
    ownerId: z.string(),
})
 
export const createAddressSchema = 
    baseAddressSchema

export const updateAddressSchema =
  baseAddressSchema
    .partial()
    .omit({
      ownerType: true,
      ownerId: true
    })
    .extend({
      id: z.int()
    })

export const ownerTypeSchema = z.enum([
  "organization",
  "member",
  "customer",
])   

export const setPrimaryAddressSchema = z.object({
  id: z.number(),
  ownerId: z.string(),
  ownerType: ownerTypeSchema,
})

export type SetPrimaryAddressInput =
  z.infer<typeof setPrimaryAddressSchema>    


export type CreateAddressInput =
  z.infer<typeof createAddressSchema>

export type UpdateAddressInput =
  z.infer<typeof updateAddressSchema>
