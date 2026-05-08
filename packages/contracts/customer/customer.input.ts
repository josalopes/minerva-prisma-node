import z from "zod";

export const baseCustomerSchema = z.object({
    name: z
      .string().min(4, { message: 'O nome deve ter no mínimo 4 caracteres'}),

    code: z.string(),

    cpfCnpj: z
      .string()
      .nullish(),
    organizationId: z.string(),

})

export const createCustomerSchema = 
    baseCustomerSchema

export const updateCustomerSchema =
  baseCustomerSchema
    .partial()

export type CreateCustomerInput =
  z.infer<typeof createCustomerSchema>

export type UpdateCustomerInput =
  z.infer<typeof updateCustomerSchema>

export type CreateCustomerFormData =
  z.infer<typeof createCustomerSchema>