import { api } from "../api-client";

interface GetProductsResponse {
    products: {
        id: number
        code: string
        name: string
        price: number
        measureUnit: string
        status: boolean
    }[]
}

export async function getProducts(org: string) {
    const result = await api
        .get(`organization/${org}/products`)
        .json<GetProductsResponse>()

    return result
}