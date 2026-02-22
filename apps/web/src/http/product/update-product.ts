import { api } from "../api-client";


interface UpdateProductRequest {
    productId: number
    org: string;
    name: string,
    code: string,
    price: number,
    measureUnit: string,
}

type UpdateProductResponse = void

export async function updateProduct({
    productId, org, name, code, price, measureUnit,
}: UpdateProductRequest): Promise<UpdateProductResponse> {
    const response = await api.put(`organization/${org}/product/${productId}`, {
        json: { 
            name, 
            code, 
            price, 
            measureUnit 
        },
    })
}

