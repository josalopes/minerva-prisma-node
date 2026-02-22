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

// type CreateAddressResponse = void
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

interface Addresses {
    addresses: {
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
    }[]
}

export async function createAddress({
    ownerType, ownerId, street, number, complement, district, city, state, zipCode, isPrimary
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
            zipCode,
            isPrimary,
        },
    }).json<CreateAddressResponse>()

    return response
}


export async function getAddresses(ownerType: string, ownerId: string) {
    const addresses = await api
        .get('addresses', { searchParams: { ownerType, ownerId } })
        .json<Addresses>()
        // .json<GetAddressesResponse>()

    return addresses
}



// import { api } from '../../http/api-client'

// export async function getAddresses(ownerType: string, ownerId: string) {
//   const response = await api.get('/addresses', {
//     searchParams: { ownerType, ownerId },
//   })
//   return response.json()
// }

// export async function createAddress(data: any) {
//   const response = await api.post('/addresses', data)
//   return response.json()
// }

// export async function updateAddress(id: string, data: any) {
//   const response = await api.put(`/addresses/${id}`, data)
//   return response.json()
// }

export async function deleteAddress(id: string) {
  await api.delete(`/addresses/${id}`)
}