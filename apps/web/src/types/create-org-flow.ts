export type CreateOrgContext = {
  step1: {
    organizationId: string
    slug: string
    name?: string
    city?: string
    addressId?: number
    addressMode: string
    companyHandled?: boolean
  }
      
  step2?: {
    street?: string
    complement?: string
    district?: string
    city?: string
    state?: string
    zipCode?: string
  }
    
  step3?: {
    file?: File | null
    preview?: string | null
    logoUrl?: string | null
  }
  
  step4?: {
    file?: File | null
    preview?: string | null
    avatarUrl?: string | null
  }
  
  addressFromCnpj?: any
  addressSource?: "cnpj" | "cep" | "manual" | null
}