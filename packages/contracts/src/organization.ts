import { z } from "zod"

// export const organizationSchema = z.object({
//   id: z.string().uuid(),
//   name: z.string(),
//   slug: z.string(),
//   cpfCnpj: z.string(),
//   domain: z.string().nullable().optional(),
//   personType: z.enum(["FISICA", "JURIDICA"]),
//   shouldAttachUserByDomain: z.boolean(),
// })

// export type Organization = z.infer<typeof organizationSchema>

// export const organizationsListSchema = z.object({
//   organizations: z.array(organizationSchema)
// })


// export const createOrganizationInputSchema = z.object({
//   name: z.string(),
//   cpfCnpj: z.string(),
//   domain: z.string().nullable().optional(),
//   shouldAttachUserByDomain: z.boolean().optional(),
//   personType: z.enum(["FISICA", "JURIDICA"])
// })

// export type CreateOrganizationInput =
//   z.infer<typeof createOrganizationInputSchema>

//   export const updateOrganizationInputSchema = z.object({
//   name: z.string(),
//   cpfCnpj: z.string(),
//   slug: z.string(),
//   domain: z.string().nullable().optional(),
//   shouldAttachUserByDomain: z.boolean().optional(),
//   personType: z.enum(["FISICA", "JURIDICA"])
// })

// export type UpdateOrganizationInput =
//   z.infer<typeof updateOrganizationInputSchema>