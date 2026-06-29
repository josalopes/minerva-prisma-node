import { z } from "zod"

export const apiSuccessSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.object({
    success: z.literal(true),
    data
  })

  export const apiEmptySuccessSchema =
    z.object({
      success: z.literal(true),
  })

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    message: z.string(),
    code: z.string().optional()
  })
})

export type ApiSuccess<T> = {
  success: true
  data: T
}

export const apiVoidSuccessSchema =
  apiSuccessSchema(z.null())

export type ApiError = z.infer<typeof apiErrorSchema>
