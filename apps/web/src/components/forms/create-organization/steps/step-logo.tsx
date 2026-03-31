import OrganizationLogoForm from "@/app/(app)/org/[slug]/update-logo-organization/organization-logo-form"
interface OrganizationLogoContentProps {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string | null;
  logoUrl: string | null;
}

export function Step2Logo(organization: OrganizationLogoContentProps) {
  return (
    <div className="space-y-4">
      <h1>Logo da organização</h1>
      <OrganizationLogoForm organization={organization}  />
    </div>
  )
}