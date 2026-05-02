import { api } from "../api-client";


interface UpdateOrganizationAvatarRequest {
    avatarUrl?: string,
    avatarPublicId?: string,
    slug: string
}

export async function updateOrganizationAvatar({
    avatarUrl,
    avatarPublicId,
    slug
}: UpdateOrganizationAvatarRequest) {
    const response = await api.patch(`organization/${slug}/avatar`, {
        json: { 
            avatarUrl,
            avatarPublicId
        },
    })

    return response
}

