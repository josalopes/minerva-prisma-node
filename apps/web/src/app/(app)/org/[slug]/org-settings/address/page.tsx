
import { ability, auth } from "@/auth/auth"
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";
import { getAddresses } from "@/services/addresses";
import { Addresses } from "@/components/address/organization-addresses";

interface AddressProps {
  params: Promise<{
    slug: string
  }>
}


export default async function PageOrganizationAddresses({ params }: AddressProps) {
  const { user } = await auth()
  const permissions = await ability()
  const { slug } = await params
  const organization = await getOrganizationBySlug(slug)
  
  const ownerType = "organization"
  const ownerId = organization.organization.id
  
  const addresses = await getAddresses({ ownerType, ownerId })

  return (
    <div className="space-y-4">
      <Addresses 
        ownerId={ownerId}
        ownerType={ownerType}
        addresses={addresses}
      />
    </div>
  )
}
