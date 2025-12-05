import z from "zod";

export const personTypeSchema = z.union([
    z.literal('FISICA'),
    z.literal('JURIDICA'),
])

export type PersonType = z.infer<typeof personTypeSchema>