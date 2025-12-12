import { api } from "./api-client";
interface CreateOrganizationRequest {
    name: string,
    cpfCnpj: string,
    domain: string | undefined,
    shouldAttachUsersByDomain: boolean,
    personType: string,
}

type CreateOrganizationResponse = void

export async function createOrganization({
    name, cpfCnpj, domain, shouldAttachUsersByDomain, personType
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const response = await api.post('organization', {
        json: { 
            name,
            cpfCnpj,
            domain, 
            shouldAttachUsersByDomain ,
            personType,
        },
    })
}

