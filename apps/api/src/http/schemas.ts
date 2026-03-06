import { AddressType } from "@prisma/client";
import z from "zod";

export const personTypeSchema = z.union([
    z.literal('FISICA'),
    z.literal('JURIDICA'),
])

export type PersonType = z.infer<typeof personTypeSchema>

export const productUnitSchema = z.union([
    z.literal('kilo'),
    z.literal('litro'),
])

export type ProductUnit = z.infer<typeof productUnitSchema>


export const typeAddressSchema = z.union([
    z.literal('GENERAL'),
    z.literal('BILLING'),
    z.literal('SHIPPING'),
])

export type typeAddress = z.infer<typeof typeAddressSchema>

export const newAddressSchema = z.object({
    ownerType: z.enum(["organization", "member"]),
    ownerId: z.string(),
    type: z.string(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
})

export const updateAddressSchema = z.object({
    type: z.string(),
    street: z.string().optional(),
    number: z.string().optional(),
    complement: z.string().optional(),
    district: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
})

// export type newAddress = z.infer<typeof newAddressSchema>
// export type updateAddress = z.infer<typeof updateAddressSchema>