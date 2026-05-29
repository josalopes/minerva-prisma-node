import { useMutation } from "@tanstack/react-query"
import { HTTPError } from "ky"

import { api } from "@/http/api-client"
import { ApiError } from "@/lib/api-error"

type Input = {
  currentPassword: string
  newPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: Input) => {
      try {
        const response = await api.patch(
          "account/password",
          {
            json: data
          }
        )

        return response.json()

      } catch (error) {
        if (error instanceof HTTPError) {
          const body = await error.response.json()

          throw new ApiError(
            error.response.status,
            body.message
          )
        }

        throw error
      }
    }
  })
}