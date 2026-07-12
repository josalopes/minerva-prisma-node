import { getCurrentOrg } from '@/auth/auth'
import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'
import OrganizationLogoForm from './organization-logo-form'

export default async function OrganizationAvatar() {
  const slug = await getCurrentOrg()

  let organizationData = null
  let organization = null

  if (slug) {
    organizationData = await getOrganizationBySlug(slug)
    organization = {
      id: organizationData.id,
      slug: organizationData.slug,
      logoUrl: organizationData.logoUrl || null,
      logoPublicId: organizationData.logoPublicId || null,
    }
  }

  return (
    <div className="space-y-4">
      {/* {permissions?.can('create', 'Project') && ( */}
      {organization && <OrganizationLogoForm organization={organization} />}
      {/* )} */}
    </div>
  )
}
