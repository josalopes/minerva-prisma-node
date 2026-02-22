import { z } from 'zod'

export const addressSchema = z.object({
  street: z.string().min(2, 'Rua obrigatória'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  district: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'UF inválida'),
  zipCode: z.string().min(8, 'CEP inválido'),
  country: z.string().optional(),
  isPrimary: z.boolean(),
  type: z.string().optional(),
})

export type AddressFormData = z.infer<typeof addressSchema>