import { api } from "../api-client";

interface GetAddressesResponse {
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
        type: string
    }[]
}

export async function getAddresses(ownerType: string, ownerId: string) {
    const addresses = await api
        .get('/addresses', { searchParams: { ownerType, ownerId } })
        .json<Addresses>()

    return addresses
}