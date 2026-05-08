import { useState } from "react"

export function useTransaction({ products, transactionType }) {

  const [items, setItems] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [weight, setWeight] = useState(0)

  function setProduct(id: string) {
    const product = products.find(p => p.id === id)
    setSelectedProduct(product || null)
  }

  const currentTotal =
    (selectedProduct?.price ?? 0) * weight

  function addItem() {
    if (!selectedProduct || weight <= 0) return

    setItems(prev => [
      ...prev,
      {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        unitPrice: selectedProduct.price,
        weight,
        total: weight * selectedProduct.price
      }
    ])

    setWeight(0)
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const total = items.reduce(
    (acc, i) => acc + i.total,
    0
  )

  async function finish() {
    await fetch("/api/transaction", {
      method: "POST",
      body: JSON.stringify({
        transactionType,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.weight
        }))
      })
    })
  }

  return {
    items,
    selectedProduct,
    weight,
    currentTotal,
    total,
    setProduct,
    setWeight,
    addItem,
    removeItem,
    finish
  }
}