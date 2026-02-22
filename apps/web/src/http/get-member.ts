import { api } from "./api-client";

interface GetMemberResponse {
        id: string
        role: string
        organizationId: string
        slug: string
}

export async function getMember() {
    const response = await api
        .get(`member`)
        .json<GetMemberResponse>()

    return response
}