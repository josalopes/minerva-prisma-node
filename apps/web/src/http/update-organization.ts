import { api } from "./api-client";


interface UpdateOrganizationRequest {
    org: string,
    name: string,
    domain: string | undefined,
    shouldAttachUsersByDomain: boolean,
}

type UpdateOrganizationResponse = void

export async function updateOrganization({
    org, name, domain, shouldAttachUsersByDomain,
}: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
    const response = await api.put(`organization/${org}`, {
        json: { 
            name, 
            domain, 
            shouldAttachUsersByDomain 
        },
    })
}

