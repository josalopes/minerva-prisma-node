import { api } from "../api-client";

interface GetOrganizationBySlugResponse {
    organization: {
        id: string;
        name: string;
        slug: string;
        avatarUrl: string | null;
        logoUrl: string | null;
    }
}

export async function getOrganizationBySlug(slug: string) {
    const response = await api
        .get(`organization/slug/${slug}`)
        .json<GetOrganizationBySlugResponse>()

    return response
}