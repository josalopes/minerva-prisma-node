import OrganizationAvatarForm from "@/app/(app)/org/[slug]/update-avatar-organization/organization-avatar-form";
interface OrganizationLogoContentProps {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  logoUrl: string | null;
}

export function Step3Avatar(organization: OrganizationLogoContentProps) {
  return (
    <div className="space-y-4">
      <h1>Avatar da organização</h1>
      <OrganizationAvatarForm organization={organization}  />
    </div>
  )
}