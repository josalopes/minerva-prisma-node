import { api } from "../api-client";

interface GetOrganizationBySlugResponse {
    organization: {
        id: string;
        name: string;
        domain: string;
        slug: string;
        cpfCnpj: string;
        personType: string;
        shouldAttachUserByDomain: boolean;
        avatarUrl: string | null;
        avatarPublicId: string;
        logoUrl: string | null;
        logoPublicId: string | null;
    }
}

export async function getOrganizationBySlug(slug: string) {
    const response = await api
        .get(`organization/slug/${slug}`)
        .json<GetOrganizationBySlugResponse>()

    return response
}