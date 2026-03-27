import { z } from "zod"

export const createOrganizationFormSchema = z.object({
  name: z.string().min(4, "O nome deve ter no mínimo 4 caracteres"),
  cpfCnpj: z.string(),
  personType: z.enum(["FISICA", "JURIDICA"]),
  domain: z.string().optional(),
  shouldAttachUserByDomain: z.boolean().optional(),

  // STEP 2
  type: z.string().optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  complement: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // STEP 3
  logo: z.string().optional(),

  // STEP 4
  avatar: z.string().optional()
})

export type CreateOrganizationFormData =
  z.infer<typeof createOrganizationFormSchema>