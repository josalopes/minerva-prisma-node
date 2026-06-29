import { useEffect, useState } from "react"

export type Product = {
  id: string
  code: string
  name: string
  price: number
}

export function useProductsCache(
  organizationId: string,
  initialProducts: Product[]
) {

  const [products, setProducts] =
    useState<Product[]>(initialProducts)

  useEffect(() => {

    const cacheKey =
      `products:${organizationId}`

    const cached =
      localStorage.getItem(cacheKey)

    if (cached) {
      setProducts(JSON.parse(cached))
    } else {
      localStorage.setItem(
        cacheKey,
        JSON.stringify(initialProducts)
      )
    }

  }, [
    organizationId,
    initialProducts
  ])

  return products
}

// export function useProductsCache(
//   organizationId: string,
//   initialProducts: Product[]
// ) {

//   const [products, setProducts] =
//     useState<Product[]>([])

//   useEffect(() => {

//     const cacheKey =
//       `products:${organizationId}`

//     const cached =
//       localStorage.getItem(cacheKey)

//     if (cached) {

//       setProducts(
//         JSON.parse(cached)
//       )

//       return
//     }

//     setProducts(initialProducts)

//     localStorage.setItem(
//       cacheKey,
//       JSON.stringify(initialProducts)
//     )

//   }, [
//     organizationId,
//     initialProducts
//   ])

//   return products
// }

