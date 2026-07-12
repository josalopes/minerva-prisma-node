import { TransactionScreen } from './create-transaction'
import { getProducts } from '@/http/product/get-products'
import { getOrganizationBySlug } from '@/http/organizations/get-organization-by-slug'

interface ProjectsProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: ProjectsProps) {
  const { slug: currentOrg } = await params
  const organization = await getOrganizationBySlug(currentOrg)

  const { products: productList } = await getProducts(currentOrg!)

  return (
    <div className="space-y-4">
      <TransactionScreen
        organizationId={organization.id}
        organizationName={organization.name}
        cpfCnpj={organization.cpfCnpj}
        slug={currentOrg}
        products={productList}
        transactionType="COMPRA"
      />
    </div>
  )
}
