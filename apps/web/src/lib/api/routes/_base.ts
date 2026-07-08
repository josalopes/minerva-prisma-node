export const org = (slug: string) => `org/${slug}`

export const orgResource = (
  slug: string,
  resource: string,
) => `${org(slug)}/${resource}`