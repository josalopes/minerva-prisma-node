"use client"

import { useEffect, useState } from "react"

export type Product = {
  id: string
  code: string
  name: string
  price: number
}

export function useProductsCache(initialProducts: Product[]) {
  const [products, setProducts] =
    useState<Product[]>([])

  const [weight, setWeight]   = useState("")

//   useEffect(() => {
//   async function syncProducts() {

//     const res = await fetch("/api/products")
//     const fresh = await res.json()

//     setProducts(fresh)

//     localStorage.setItem(
//       "products",
//       JSON.stringify(fresh)
//     )
//   }

//   syncProducts()

// }, [])

  useEffect(() => {
    const cached =
      localStorage.getItem("products")

    // 🔥 cache existente
    if (cached) {
      setProducts(JSON.parse(cached))
      return
    }

    // 🔥 primeira carga
    setProducts(initialProducts)

    localStorage.setItem(
      "products",
      JSON.stringify(initialProducts)
    )
  }, [initialProducts])

  return products
}