import { ability, auth, getCurrentOrg } from "@/auth/auth"
import OrganizationAvatarForm from "./organization-avatar-form";
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";

export default async function OrganizationAvatar() {
  const { user } = await auth()
  const permissions = await ability()
  const slug = await getCurrentOrg()

  let organizationData = null
  let organization = null
  let org = null

  if (slug) {
    organizationData = (await getOrganizationBySlug(slug)).organization;
    organization = {
      id: organizationData.id,
      name: organizationData.name,
      slug: organizationData.slug,
      avatarUrl: organizationData.avatarUrl || null,
      avatarPublicId: organizationData.avatarPublicId || null,
      logoUrl: organizationData.avatarUrl || null,
      logoPublicId: organizationData.logoPublicId || null,
    }
  }

  return (
    <div className="space-y-4">
        {/* {permissions?.can('create', 'Project') && ( */}
            {organization && <OrganizationAvatarForm organization={organization} />}
            {/* {organization && <OrganizationAvatarForm organization={organization} user={user}  />} */}
        {/* )} */}
    </div>
  )
}
