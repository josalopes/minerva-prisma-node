import { HTTPError } from "ky"
import { ZodType } from "zod"
import { ApiError } from "./api-types"

export async function apiRequest<T>(
  request: Promise<Response>,
  schema: ZodType<{ success: true; data: T }>
): Promise<T> {

  function getApiErrorMessage(err: any) {
    if (err?.error?.message) return err.error.message
    if (err?.message) return err.message
    return "Erro na API"
  }
  try {

    const response = await request
    const json = await response.json()

    const parsed = schema.parse(json)

    return parsed.data

  } catch (error) {
    if (error instanceof HTTPError) {
      const err = await error.response.json() as ApiError | { message?: string }

      throw new Error(getApiErrorMessage(err))
    }

    throw error
  }
}
