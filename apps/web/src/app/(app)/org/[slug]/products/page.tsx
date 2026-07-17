// import { ability } from "@/auth/auth"
import { getProducts } from '@/http/product/get-products'
import ProductList from './products-list'

interface ProjectsProps {
  params: Promise<{
    slug: string
  }>
}

export default async function Projects({ params }: ProjectsProps) {
  const { slug: currentOrg } = await params
  // const permissions = await ability()
  const { products: productList } = await getProducts(currentOrg!)

  return (
    <div className="space-y-4">
      {/* {permissions?.can('create', 'Project') && ( */}
      <ProductList productList={productList} />
      {/* )} */}
    </div>
  )
}
