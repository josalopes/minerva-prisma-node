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
    isPrimary: boolean
}

interface Address {
    id: number
    street: string
    number: string
    complement: string
    district: string
    city: string
    state: string
    zipCode: string
    country: string
    isPrimary: boolean
}

export async function createAddress({
    ownerType, ownerId, street, number, complement, district, city, state, country, zipCode, isPrimary
}: CreateAddressRequest): Promise<CreateAddressResponse> {
    const response = await api.post('addresses', {
        json: { 
            ownerType,
            ownerId,
            street,
            number,
            complement,
            district,
            city,
            state,
            country,
            zipCode,
            isPrimary,
        },
    }).json<CreateAddressResponse>()

    return response
}


export async function getAddresses(
  ownerType: string,
  ownerId: string
): Promise<Address[]> {
  const addresses = await api
    .get('addresses', { searchParams: { ownerType, ownerId } })
    .json<Address[]>()

  return addresses
}

export async function deleteAddress(id: string) {
  await api.delete(`/addresses/${id}`)
}