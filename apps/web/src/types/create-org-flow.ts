export type CreateOrgContext = {
  step1: {
    name?: string
    city?: string
    slug: string
    organizationId: string
    addressId?: number
    addressMode: string
    companyHandled?: boolean
  }

  addressFromCnpj?: {
    street?: string
    complement?: string
    district?: string
    city?: string
    state?: string
    zipCode?: string
  }

  addressSource?: "cnpj" | "cep" | "manual" | null
}