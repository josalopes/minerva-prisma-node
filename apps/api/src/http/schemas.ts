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