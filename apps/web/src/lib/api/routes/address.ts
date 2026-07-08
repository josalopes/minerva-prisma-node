import { org } from './_base'

export const addressRoutes = {
  list: (slug: string) => `${org(slug)}/addresses`,
  create: (slug: string) => `${org(slug)}/address`,
  update: (slug: string, id: number) => `${org(slug)}/address/${id}`,
  remove: (slug: string, id: number) => `${org(slug)}/address/${id}`,
  setPrimary: (slug: string, id: number) => `${org(slug)}/address/${id}`,
}
