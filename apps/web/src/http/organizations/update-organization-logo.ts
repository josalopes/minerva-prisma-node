import { api } from "../api-client";


interface UpdateOrganizationLogoRequest {
    logoUrl?: string,
    logoPublicId?: string,
    slug: string
}

export async function updateOrganizationLogo({
    logoUrl,
    logoPublicId,
    slug
}: UpdateOrganizationLogoRequest) {
    const response = await api.patch(`organization/${slug}/logo`, {
        json: { 
            logoUrl,
            logoPublicId
        },
    })

    return response
}

