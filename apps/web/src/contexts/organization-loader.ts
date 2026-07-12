import { getCurrentOrg } from '@/auth/auth'

export async function loadOrganization(): Promise<string | null> {
  const currentOrg = await getCurrentOrg()

  return currentOrg
}
