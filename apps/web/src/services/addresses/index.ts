import z from 'zod'
import { api } from '../../http/api-client'

import {
  Address,
  SetPrimaryAddressInput,
  UpdateAddressInput,
} from '@saas/contracts'
import { createAddressSchema } from '@saas/contracts'
import { addressRoutes } from '@/lib/api/routes'

type CreateAddressInput = z.infer<typeof createAddressSchema>

export async function createAddress(slug: string, data: CreateAddressInput) {
  return api
    .post(addressRoutes.create(slug), {
      json: data,
    })
    .json<Address>()
}

export async function updateAddress(
  slug: string,
  id: number,
  data: UpdateAddressInput,
) {
  return api
    .patch(addressRoutes.update(slug, id), {
      json: data,
    })
    .json<Address>()
}

export async function getAddresses(
  slug: string,
  ownerId: string,
  ownerType: string,
) {
  return api
    .get(addressRoutes.list(slug), {
      searchParams: {
        ownerId,
        ownerType,
      },
    })
    .json<Address[]>()
}

export async function deleteAddress(slug: string, id: number) {
  await api.delete(addressRoutes.remove(slug, id))
}

export async function setPrimaryAddress(
  slug: string,
  payload: SetPrimaryAddressInput,
) {
  const data = {
    ownerId: payload.ownerId,
    ownerType: payload.ownerType,
  }
  await api.patch(addressRoutes.setPrimary(slug, payload.id), {
    json: data,
  })
}
