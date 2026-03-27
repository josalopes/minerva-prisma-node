import { ApiSuccess } from "@/http/api-errors";
import { api } from "../api-client";


interface UpdateOrganizationRequest {
    slug: string,
    name: string,
    domain: string | undefined,
    shouldAttachUserByDomain: boolean,
}

interface Organization {
  id: string
  name: string
  cpfCnpj: string
  slug: string
  domain: string | null
  shouldAttachUserByDomain: boolean
  personType: string
  avatarUrl: string | null
  logoUrl: string | null
  createdAt: string
  updatedAt: string | null
  deletedAt: string | null
  ownerId: string | null
}

// type UpdateOrganizationResponse

interface UpdateOrganizationResponse {
  organization: Organization
}


export async function updateOrganization(
    data: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
    const response = await api.put(`organization`, {
         json: data 
        }).json<ApiSuccess<UpdateOrganizationResponse>>()
        
    return response.data
}
// export async function updateOrganization({
//     slug, name, domain, shouldAttachUserByDomain,
// }: UpdateOrganizationRequest): Promise<UpdateOrganizationResponse> {
//     const response = await api.put(`organization`, {
//     // const response = await api.put(`organization/${org}`, {
//         json: { 
//             name, 
//             slug,
//             domain, 
//             shouldAttachUserByDomain 
//         },
//     })
// }

