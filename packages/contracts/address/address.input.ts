import z from "zod";
import { addressOwnerTypeSchema, addressTypeSchema } from "./address.entity";

export const baseAddressSchema = z.object({
  street: z.string().nullish(),
  number: z.string().nullish(),
  complement: z.string().nullish(),
  district: z.string().nullish(),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zipCode: z.string().nullish(),
  type: addressTypeSchema,
  isPrimary: z.coerce.boolean(),
  ownerType: addressOwnerTypeSchema,
  ownerId: z.string(),
});

export const createAddressSchema = baseAddressSchema.strict();

export const updateAddressSchema = baseAddressSchema
  .omit({
    ownerType: true,
    ownerId: true,
  })
  .partial();

export const setPrimaryAddressSchema = z.object({
  id: z.number(),
  ownerId: z.string(),
  ownerType: addressOwnerTypeSchema,
});

export type SetPrimaryAddressInput = z.infer<typeof setPrimaryAddressSchema>;

export type AddressTypeInput = z.infer<typeof addressTypeSchema>;

export type CreateAddressInput = z.infer<typeof createAddressSchema>;

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
