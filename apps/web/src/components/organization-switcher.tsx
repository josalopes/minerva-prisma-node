import { getOrganizations } from '@/http/organizations/get-organizations'
import { ability, getCurrentOrg } from '@/auth/auth'
import { OrganizationSwitcherClient } from './organization-switcher-client'

export async function OrganizationSwitcher() {
  const currentOrgSlug = await getCurrentOrg()
  const organizations = await getOrganizations()
  const permissions = await ability()

  const filteredOrganizations = organizations.filter((org) => org.slug !== '100000')

  const currentOrganization =
    filteredOrganizations.find((org) => org.slug === currentOrgSlug) ?? null

    const canUpdateOrganization = permissions?.can('update', 'Organization')  

  return (
    <OrganizationSwitcherClient
      organizations={filteredOrganizations}
      currentOrganization={currentOrganization}
      canUpdateOrganization={canUpdateOrganization}
    />
  )
}
