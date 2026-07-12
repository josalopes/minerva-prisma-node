// import { ability, auth } from '@/auth/auth'
import { AddressList } from '@/services/addresses/address-list'
import Header from '@/components/header'
import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'
import { getAddresses } from '@/services/addresses'

interface AddressProps {
  params: Promise<{
    slug: string
  }>
}

export default async function OrganizationAddresses({ params }: AddressProps) {
  // const { user } = await auth()
  // const permissions = await ability()

  const { slug } = await params
  const organization = await getOrganizationBySlug(slug)

  const ownerId = organization.id
  const ownerType = 'ORGANIZATION'

  const addresses = await getAddresses(slug, ownerId, ownerType)

  return (
    <div className="space-y-4">
      <Header />
      <AddressList
        addresses={addresses}
        slug={slug}
        ownerType={ownerType}
        ownerId={ownerId}
      />
    </div>
  )
}
