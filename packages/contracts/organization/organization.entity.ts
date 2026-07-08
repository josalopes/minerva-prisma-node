import { z } from "zod";

export const organizationEntitySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  cpfCnpj: z.string(),

  domain: z.string().nullable().optional(),

  personType: z.enum(["FISICA", "JURIDICA"]),
  shouldAttachUserByDomain: z.boolean(),

  avatarUrl: z.string().url().nullable().optional(),
  avatarPublicId: z.string().nullable().optional(),

  logoUrl: z.string().url().nullable().optional(),
  logoPublicId: z.string().nullable().optional(),
});

export type Organization = z.infer<typeof organizationEntitySchema>;

// import { z } from "zod"

// export const organizationEntitySchema = z.object({
//   id: z.string(),
//   slug: z.string(),
//   name: z.string(),
//   cpfCnpj: z.string(),
//   domain: z.string().nullable().optional(),
//   personType: z.enum(["FISICA", "JURIDICA"]),
//   shouldAttachUserByDomain: z.boolean()
// })

// export type Organization =
//   z.infer<typeof organizationEntitySchema>
