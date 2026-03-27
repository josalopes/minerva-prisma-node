import { api } from "../api-client";


interface UpdateProfileRequest {
    avatarUrl?: string,
}

export async function updateProfile({
    avatarUrl,
}: UpdateProfileRequest) {
    const response = await api.put('profile/avatar', {
        json: { 
            avatarUrl, 
        },
    })

    return response
}

