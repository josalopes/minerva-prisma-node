"use client"

import { toast } from "sonner"

interface ActionResult {
  success: boolean
  message?: string | null
  errors?: Record<string, string[]>
}

export function useServerAction<T extends (...args: any[]) => Promise<ActionResult>>(action: T) {

  async function execute(formData: FormData) {

    const result = await action(formData)

    if (!result.success) {

      if (result.message) {
        toast.error(result.message)
        return result
      }

      if (result.errors) {
        const firstError =
          Object.values(result.errors)[0]?.[0]

        if (firstError) {
          toast.error(firstError)
        }
      }

      return result
    }

    return result
  }

  return { execute }
}