import { api } from "../api-client";

interface DeleteProductRequest {
    org: string,
    productCode: string
}

export async function deleteProduct({
    org,
    productCode
}: DeleteProductRequest) {
    await api.delete(`organization/${org}/product/${productCode}`)

}