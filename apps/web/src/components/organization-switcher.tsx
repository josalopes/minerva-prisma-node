import { getOrganizations } from '@/http/organizations/get-organizations'
import { ability, getCurrentOrg } from '@/auth/auth'
import { OrganizationSwitcherClient } from './organization-switcher-client'

export async function OrganizationSwitcher() {
  const organizations = await getOrganizations()

  const currentOrgSlug = await getCurrentOrg()

  const currentOrganization =
    organizations.find((org) => org.slug === currentOrgSlug) ?? null

  const permissions = currentOrganization ? await ability() : null

  return (
    <OrganizationSwitcherClient
      organizations={organizations}
      currentOrganization={currentOrganization}
      canUpdateOrganization={permissions?.can('update', 'Organization')}
    />
  )
}
