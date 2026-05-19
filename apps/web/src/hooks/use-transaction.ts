import { useState } from "react"
import { useMaskWeightInput } from "./use-mask-weight-input"

type Product = {
  id: string
  code: string
  name: string
  price: number
  measureUnit: string
  status: boolean
}

type TransactionItem = {
  productId: string
  productName: string
  unitPrice: number
  weight: number
  total: number
}

type Props = {
  products: Product[]
  transactionType: "COMPRA" | "VENDA"
}

export function useTransaction({ products, transactionType }: Props) {
  const [items, setItems] = useState<TransactionItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const weightInput = useMaskWeightInput()

  const currentTotal =
    (selectedProduct?.price ?? 0) * weightInput.parsedValue

  function setProduct(id: string) {
    const product = products.find(p => p.id === id) || null
    setSelectedProduct(product)
  }

  function addItem() {
    if (!selectedProduct) return false
    
    const parsedWeight = weightInput.parsedValue

    if (parsedWeight <= 0) return false
 
    setItems(prev => [
      ...prev,
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        weight: parsedWeight,
        unitPrice: selectedProduct.price,
        total: currentTotal
      }
    ])

    weightInput.reset()

    return true
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce(
    (acc, i) => acc + i.total,
    0
  )

  function reset() {
    setItems([])
    setSelectedProduct(null)

    weightInput.reset()
  }

  return {
    items,
    total,
    currentTotal,
    selectedProduct,
    weightInput,
    setProduct,
    addItem,
    removeItem,
    reset
  }
}