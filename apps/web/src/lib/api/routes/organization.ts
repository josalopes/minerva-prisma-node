import { org } from "./_base"

export const organizationRoutes = {
    list: () => "/organizations",
  
    create: () => "/organizations",
  
    bySlug: (slug: string) =>
      `/org/${slug}`,
  
    update: (slug: string) =>
      `/org/${slug}`,
  }