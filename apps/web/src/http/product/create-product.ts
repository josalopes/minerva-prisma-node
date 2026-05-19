import { api } from "../api-client";
interface CreateProductRequest {
    org: string,
    name: string,
    code: string,
    price: Number,
    measureUnit: string
}

type CreateProductResponse = void

export async function createProduct({
    org, name, code, price, measureUnit
}: CreateProductRequest): Promise<CreateProductResponse> {    
    const response = await api.post(`organization/${org}/product`, {
        json: { 
            name, 
            code,
            price,
            measureUnit,
        },
    })
}

