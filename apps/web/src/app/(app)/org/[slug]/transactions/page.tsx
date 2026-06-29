import { ability, auth, getCurrentOrg } from "@/auth/auth"
import { TransactionScreen } from "./create-transaction";
import { getProducts } from "@/http/product/get-products";
import { getOrganizationBySlug } from "@/http/organizations/get-organization-by-slug";

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
        organizationId={organization.organization.id}
        organizationName={organization.organization.name}
        cpfCnpj={organization.organization.cpfCnpj}
        slug={currentOrg}
        products={productList}
        transactionType="COMPRA"
      />
    </div>
  )
}
