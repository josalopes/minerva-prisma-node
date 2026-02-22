import { api } from "./api-client";


interface UpdateOrganizationLogoRequest {
    logoUrl?: string,
    slug: string
}

export async function updateOrganizationLogo({
    logoUrl,
    slug
}: UpdateOrganizationLogoRequest) {
    const response = await api.put(`organization/${slug}/logo`, {
        json: { 
            logoUrl
        },
    })

    return response
}

