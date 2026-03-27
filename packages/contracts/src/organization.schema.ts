import { z } from "zod"

export const personTypeSchema = z.enum(["FISICA", "JURIDICA"])

export const organizationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  cpfCnpj: z.string(),
  domain: z.string().nullable(),
  personType: z.string(),
  shouldAttachUserByDomain: z.boolean(),
})

export const organizationsListSchema = z.object({
  organizations: z.array(organizationSchema)
})


export const baseOrganizationSchema = z.object({
    name: z
      .string().min(4, { message: 'O nome deve ter no mínimo 4 caracteres'}),

    cpfCnpj: z
      .string({ message: 'CPF/CNPJ é obrigatório.' })
      .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return replacedDoc.length >= 11;
        }, 'CPF/CNPJ deve conter no mínimo 11 caracteres.')
        .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return replacedDoc.length <= 14;
        }, 'CPF/CNPJ deve conter no máximo 14 caracteres.')
        .refine((doc) => {
        const replacedDoc = doc.replace(/\D/g, '');
        return !!Number(replacedDoc);
        }, 'CPF/CNPJ deve conter apenas números.'),
    personType: z.enum(["FISICA", "JURIDICA"]),

    domain: z
        .string()
        .nullish()
        .refine((value) => {
        if (!value) return true

        const domainRegex =
            /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

        return domainRegex.test(value)
        }, "Entre com um domínio válido"),
    shouldAttachUserByDomain: z.coerce.boolean().default(false)
})
.refine(
    (data) => {
        if (data.shouldAttachUserByDomain === true && !data.domain) {
            return false
        }

        return true
    },
    {
        message: 'O domínio é obrigatório ao habilitar a auto-vinculação'
    }
) 

export const createOrganizationSchema = 
    baseOrganizationSchema.refine(
    (data) => {
        if (data.shouldAttachUserByDomain === true && !data.domain) {
            return false
        }

        return true
    },
    {
        message: 'O domínio é obrigatório ao habilitar a auto-vinculação'
    }
)

export const updateOrganizationSchema =
  baseOrganizationSchema
    .partial()
    .extend({
      slug: z.string()
    })

export type CreateOrganizationInput =
  z.infer<typeof createOrganizationSchema>

export type UpdateOrganizationInput =
  z.infer<typeof updateOrganizationSchema>

export type Organization = z.infer<typeof organizationSchema>