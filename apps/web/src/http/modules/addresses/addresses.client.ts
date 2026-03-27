import { api } from "@/http/api-client"
import { apiRequest } from "@/http/api-request"
import { apiSuccessSchema } from "@/http/api-types"

import { CreateAddressInput, UpdateAddressInput
 } from './../../../../../../packages/contracts/address';

import {
  addressEntitySchema,
  addressListSchema
} from "../../../../../../packages/contracts/address"

export const addressesClient = {

  async get() {
    const schema = apiSuccessSchema(
      addressListSchema
    )

    const data = await apiRequest(
      api.get("addresses"),
      schema
    )

    return data.addresses
  },

  async create(data: CreateAddressInput) {
    const schema = apiSuccessSchema(
      addressEntitySchema
    )

    const result = await apiRequest(
      api.post("addresses", { json: data }),
      schema
    )

    return result
  },

  async update(data: UpdateAddressInput) {
    const schema = apiSuccessSchema(
      addressEntitySchema
    )

    const id = data.id

    const result = await  apiRequest(
      api.patch(`address/entity/${id}`, { json: data }),
      schema
    )
        
    return result
  }
}