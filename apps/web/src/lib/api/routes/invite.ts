export const inviteRoutes = {
    list: (slug: string) =>
      `/org/${slug}/invites`,
  
    create: (slug: string) =>
      `/org/${slug}/invite`,
  
    revoke: (slug: string, id: string) =>
      `/org/${slug}/invite/${id}`,
  }