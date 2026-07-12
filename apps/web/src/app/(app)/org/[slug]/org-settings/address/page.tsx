// import { ability, auth } from '@/auth/auth'
import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'
import { getAddresses } from '@/services/addresses'
import { Addresses } from '@/components/address/organization-addresses'

interface AddressProps {
  params: Promise<{
    slug: string
  }>
}

export default async function PageOrganizationAddresses({
  params,
}: AddressProps) {
  // const { user } = await auth()
  // const permissions = await ability()
  const { slug } = await params
  const organization = await getOrganizationBySlug(slug)

  const ownerType = 'ORGANIZATION'
  const ownerId = organization.id

  const addresses = await getAddresses(slug, ownerId, ownerType)

  return (
    <div className="space-y-4">
      <Addresses
        ownerType={ownerType}
        ownerId={ownerId}
        addresses={addresses}
      />
    </div>
  )
}
