import { HTTPError } from "ky"
import { z } from "zod"
import { ApiError } from "./api-types"

export async function apiRequest<TSchema extends z.ZodTypeAny>(
  request: Promise<Response>,
  schema: TSchema,
): Promise<z.infer<TSchema>> {

  function getApiErrorMessage(err: any) {
    if (err?.error?.message) return err.error.message
    if (err?.message) return err.message
    return "Erro na API"
  }

  try {
    const response = await request
    const json = await response.json()

    return schema.parse(json)
  } catch (error) {
    if (error instanceof HTTPError) {
      const err =
        await error.response.json() as
          ApiError | { message?: string }

      throw new Error(getApiErrorMessage(err))
    }

    throw error
  }
}

