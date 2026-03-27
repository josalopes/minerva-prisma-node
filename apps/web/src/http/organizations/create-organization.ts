import { ApiSuccess } from '../api-errors';
import { api } from "../api-client"

interface CreateOrganizationRequest {
  name: string
  cpfCnpj: string
  domain?: string
  shouldAttachUserByDomain?: boolean
  personType: string
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

interface CreateOrganizationResponse {
  organization: Organization
}

export async function createOrganization(
  data: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  const response = await api
    .post("organization", {
      json: data
    })
    .json<ApiSuccess<CreateOrganizationResponse>>()

  return response.data
}
