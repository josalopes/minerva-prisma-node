import { z } from "zod"

// =========================
// ITEM
// =========================
export const transactionItemSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  weight: z.number(),
  unitPrice: z.number(),
  // quantity: z.number(),
  // value: z.number(),
})

// =========================
// TRANSACTION RESPONSE
// =========================
export const transactionResponseSchema = z.object({
  id: z.string(),
  totalValue: z.number(),
  date: z.string(),

  transactionItems: z.array(transactionItemSchema)
})

// =========================
// API RESPONSE PADRÃO
// =========================
export const successResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.literal(true),
    data: schema
  })

// =========================
// TYPES AUTOMÁTICOS
// =========================
export type TransactionResponse =
  z.infer<typeof transactionResponseSchema>

export type TransactionItem =
  z.infer<typeof transactionItemSchema>


export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional()
  })
})  