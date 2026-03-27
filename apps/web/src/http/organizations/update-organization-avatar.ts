import { api } from "../api-client";


interface UpdateOrganizationAvatarRequest {
    avatarUrl?: string,
    slug: string
}

export async function updateOrganizationAvatar({
    avatarUrl,
    slug
}: UpdateOrganizationAvatarRequest) {
    console.log('AVATAR e SLUG: ', avatarUrl, slug)
    const response = await api.put(`organization/${slug}/avatar`, {
        json: { 
            avatarUrl,
        },
    })

    return response
}

