import { api } from '@/http/api-client'
import { apiRequest } from '@/http/api-request'
import { apiSuccessSchema } from '@/http/api-types'
import {
  createAddress,
  deleteAddress,
  setPrimaryAddress,
  updateAddress,
} from '@/services/addresses'

import {
  CreateAddressInput,
  SetPrimaryAddressInput,
  UpdateAddressInput,
} from '@saas/contracts'
import { addressListSchema } from '@saas/contracts'

interface CreateProps {
  slug: string
  payload: CreateAddressInput
}

interface UpdateProps {
  slug: string
  id: number
  payload: UpdateAddressInput
}

interface SetPrimaryProps {
  slug: string
  payload: SetPrimaryAddressInput
}

export const addressesClient = {
  async get() {
    const schema = apiSuccessSchema(addressListSchema)
    const data = await apiRequest(api.get('addresses'), schema)

    return data
  },

  async create({ slug, payload }: CreateProps) {
    const result = await createAddress(slug, payload)

    return result
  },

  async update({ slug, id, payload }: UpdateProps) {
    const result = await updateAddress(slug, id, payload)

    return result
  },

  async delete(slug: string, id: number) {
    await deleteAddress(slug, id)
  },

  async setPrimary({ slug, payload }: SetPrimaryProps) {
    await setPrimaryAddress(slug, payload)
  },
}
