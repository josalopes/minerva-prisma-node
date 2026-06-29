import { ability, auth } from "@/auth/auth"
import { AddressList } from "@/services/addresses/address-list";
import Header from "@/components/header";
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";

interface AddressProps {
  params: Promise<{
    slug: string
  }>
}

export default async function OrganizationAddresses({ params }: AddressProps) {
  const { user } = await auth()
  const permissions = await ability()
  const { slug: currentOrg } = await params
  const organization = await getOrganizationBySlug(currentOrg)

  return (
    <div className="space-y-4">
      <Header />
      <AddressList 
        ownerType="organization"
        ownerId={organization.organization.id}
      />
    </div>
  )
}
