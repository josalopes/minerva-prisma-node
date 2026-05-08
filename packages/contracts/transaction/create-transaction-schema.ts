import { z } from "zod"

export const transactionItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().int().positive(), // valor unitário
})

export const createTransactionSchema = z.object({
  organizationId: z.string(),
  cpfCnpj: z.string().nullish(),
  items: z.array(transactionItemSchema).min(1),
  transactionType: z.enum(["VENDA", "COMPRA"]),
})

export type CreateTransactionInput =
  z.infer<typeof createTransactionSchema>

export const transactionResponseSchema = z.object({
  id: z.string(),
  totalValue: z.number(),
})  