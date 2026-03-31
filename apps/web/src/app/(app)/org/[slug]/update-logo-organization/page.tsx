import { ability, auth, getCurrentOrg } from "@/auth/auth"
import OrganizationAvatarForm from "./organization-logo-form";
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";
import Header from "@/components/header";

export default async function OrganizationAvatar() {
  const { user } = await auth()
  const permissions = await ability()
  const slug = await getCurrentOrg()

  let organizationData = null
  let organization = null

  if (slug) {
    organizationData = (await getOrganizationBySlug(slug)).organization;
    organization = {
      id: organizationData.id,
      name: organizationData.name,
      slug: organizationData.slug,
      avatarUrl: organizationData.avatarUrl || null,
      logoUrl: organizationData.avatarUrl || null,
    }
  }

  return (
    <div className="space-y-4">
      <Header />
        {/* {permissions?.can('create', 'Project') && ( */}
            {organization && <OrganizationAvatarForm organization={organization}  />}
            {/* {organization && <OrganizationAvatarForm organization={organization} user={user}  />} */}
        {/* )} */}
    </div>
  )
}
