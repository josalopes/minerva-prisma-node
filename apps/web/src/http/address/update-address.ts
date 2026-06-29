import { api } from "@/http/api-client"

import {
  CreateAddressRequest
} from "./create-address"

export async function updateAddress(
  id: number,
  data: CreateAddressRequest
) {

  const response =
    await api.patch(
      `address/${id}`,
      {
        json: data
      }
    )

  return response.json()
}