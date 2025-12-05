import { api } from "./api-client";
import { PersonType } from "./schemas";
interface CreateOrganizationRequest {
    name: string,
    cpfCnpj: string,
    domain: string | null,
    shouldAttachUsersByDomain: boolean,
    personType: PersonType,
    avatarUrl: string | null
}

type CreateOrganizationResponse = void

export async function createOrganization({
    name, cpfCnpj, domain, shouldAttachUsersByDomain, personType, avatarUrl
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
    const response = await api.post('organization', {
        json: { 
            name,
            cpfCnpj,
            domain, 
            shouldAttachUsersByDomain ,
            personType,
            avatarUrl
        },
    })
}

