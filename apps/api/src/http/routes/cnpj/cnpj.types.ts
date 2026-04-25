export type CnpjData = {
  document: string
  name: string
  tradeName?: string
  cnae?: string

  email?: string
  phone?: string

  address: {
    street?: string
    number?: string
    complement?: string
    district?: string
    city?: string
    state?: string
    zipCode?: string
  }
}