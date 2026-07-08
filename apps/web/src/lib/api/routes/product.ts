import { org } from "./_base"

export const productRoutes = {
  list: (slug: string) =>
    `${org(slug)}/products`,

  create: (slug: string) =>
    `${org(slug)}/products`,

  update: (slug: string, id: string) =>
    `${org(slug)}/products/${id}`,

  remove: (slug: string, id: string) =>
    `${org(slug)}/products/${id}`,
}