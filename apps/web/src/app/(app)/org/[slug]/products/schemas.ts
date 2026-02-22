import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(4, { message: 'O nome deve ter no mínimo 4 caracteres' }),
    code: z.string().min(1, { message: 'O código não pode ser nulo' }),
    price: z.string().min(1, { message: 'O preço não pode ser nulo' }),
    measureUnit: z.string().min(1, { message: 'A unidade não pode ser nula' }),
    status: z.string().optional()
})

export type ProductSchema = z.infer<typeof productSchema>
