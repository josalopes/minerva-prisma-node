import { Address } from "@/types/address";
import { api } from "../../http/api-client";
interface CreateAddressRequest {
    ownerType: string,
    ownerId: string,
    street: string,
    number: string,
    complement: string,
    district: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    isPrimary: boolean
}
interface CreateAddressResponse {
    ownerType: string,
    ownerId: string,
    street: string,
    number: string,
    complement: string,
    district: string,
    city: string,
    state: string,
    zipCode: string,
    isPrimary: boolean,
    type: string
}

export async function createAddress({
    ownerType, ownerId, street, number, complement, district, city, state, country, zipCode, isPrimary
}: CreateAddressRequest): Promise<CreateAddressResponse> {
    const response = await api.post('addresses', {
        json: { 
          street,
          number,
          complement,
          district,
          city,
          state,
          zipCode,
          country,
          ownerType,
          ownerId,
          isPrimary,
        },
    }).json<CreateAddressResponse>()

    return response
}

interface getAddressesProps {
  ownerId: string
  ownerType: string
}

export async function getAddresses(
  {
    ownerType,
    ownerId
  }: getAddressesProps
): Promise<Address[]> {

  const addresses = await api
    .get('addresses', { searchParams: { ownerType, ownerId } })
    .json<Address[]>()

  return addresses
}

export async function deleteAddress(id: number) {
  await api.delete(`address/${id}`)
}

type SetPrimaryAddressInput = {
  id: number
  ownerId: string
  ownerType: string
}

export async function setPrimaryAddress({
  id,
  ownerId,
  ownerType,
}: SetPrimaryAddressInput) {
  await api.patch(`address/${id}/primary`, {
    json: {
      ownerId,
      ownerType,
    },
  })
}