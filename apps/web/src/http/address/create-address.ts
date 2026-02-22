import { api } from "../api-client";
interface CreateAddressRequest {
    ownerType: string,
    ownerId: string,
    street: string,
    number: string,
    complement?: string,
    district: string,
    city: string,
    state: string,
    country: string,
    zipCode: string,
    isPrimary: boolean,
    type: string
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
    isPrimary: boolean,
    type: string
}

export async function createAddress({
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
    type
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
            type
        },
    }).json<CreateAddressResponse>()

    return response
}

