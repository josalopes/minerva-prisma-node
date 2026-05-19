import { z } from "zod"

import { api } from "@/http/api-client"

import {
  errorResponseSchema,
  successResponseSchema
} from "@saas/contracts/transaction/transaction"

export async function apiRequest<
  T extends z.ZodTypeAny
>(
  input: string,
  init: RequestInit,
  schema: T
): Promise<z.infer<T>> {

  const raw = await api(input, {
    method: init.method,

    json: init.body
      ? JSON.parse(init.body as string)
      : undefined
  }).json()

  // ❌ erro
  if (
    typeof raw === "object" &&
    raw !== null &&
    "success" in raw &&
    raw.success === false
  ) {

    const parsedError =
      errorResponseSchema.parse(raw)

    throw new Error(
      parsedError.error.message
    )
  }

  // ✅ sucesso
  const successSchema =
    successResponseSchema(schema)

  const parsed =
    successSchema.parse(raw)

  return (parsed as { data: z.infer<T> }).data
}