"use client"

import { useRef, useState } from "react"
import { useTransaction } from "@/hooks/use-transaction"
import { ReceiptModal } from "./receipt-modal"
import { TransactionResponse } from "@/types/transaction"
import { useCreateTransaction } from "./use-create-transaction"
import { useProductsCache } from "@/hooks/use-products-cache"
import { ProductSearch } from "./product-search"
import { formatCurrency } from "@/utils/format"

type Product = {
  id: string
  code: string
  name: string
  price: number
  measureUnit: string
  status: boolean
}

type Props = {
  organizationId: string
  organizationName: string
  cpfCnpj: string
  slug: string
  products: Product[]
  transactionType: "COMPRA" | "VENDA"
}

export function TransactionScreen({ slug, products, transactionType, organizationName, organizationId, cpfCnpj }: Props) {
  const {
    selectedProduct,
    items,
    total,
    currentTotal,
    weightInput,
    setProduct,
    addItem,
    removeItem,
    reset
  } = useTransaction({ products, transactionType })
  const productSearchRef = useRef<HTMLInputElement>(null)

  const weightRef = useRef<HTMLInputElement>(null)
  const cachedProducts = useProductsCache(organizationId, products)
  const mutation = useCreateTransaction()

  const [receiptOpen, setReceiptOpen] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<TransactionResponse | null>(null)

  async function handleFinish() {
    try {
      const data = await mutation.mutateAsync({
        slug,
        transactionType,
        items: items.map(i => ({
          productId: i.productId,
          quantity: i.weight
        }))
      })

      setLastTransaction(data)
      setReceiptOpen(true)

    } catch (err) {
      console.error(err)
    }
  }

  function handleAddItem() {
    const success = addItem()

    if (success) {
      productSearchRef.current?.focus()
    }
  }

  function handleCloseReceipt() {
    reset()
    setLastTransaction(null)
    setReceiptOpen(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      {/* 🔝 INPUT AREA */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">

        <div className="grid grid-cols-4 gap-3">
          {/* Produto */}
          <div className="col-span-4">
            <ProductSearch
              ref={productSearchRef}
              products={products}
              // products={cachedProducts}
              onSelect={(product) => {
                setProduct(product.id)

                setTimeout(() => {
                  weightRef.current?.focus()
                }, 50)
              }}
            />
          </div>

          <input
            className="border rounded p-2 bg-gray-100 col-span-2"
            value={selectedProduct?.name ?? ""}
            readOnly
          />

          {/* Preço */}
          <input
            className="border rounded p-2 bg-gray-100 col-span-2"
            value={formatCurrency(selectedProduct?.price ?? 0)}
            readOnly
          />

          {/* Peso */}
          <input
            ref={weightRef}
            type="text"
            inputMode="decimal"
            placeholder="0,000 kg"

            className="
              border rounded-lg 
              h-14 px-4 text-lg 
              col-span-2
            "
            value={weightInput.value}
            onChange={weightInput.onChange}

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddItem()
              }
            }}
          />

          {/* Total atual */}
          <div className="flex items-center justify-center font-bold col-span-2">
            {formatCurrency(currentTotal)}
            {/* {formatCurrency(total)} */}
          </div>
        </div>

        <button
          onClick={handleAddItem}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Adicionar item
        </button>
      </div>

      {/* 📋 ITEMS */}
      <div className="bg-white p-4 rounded-xl shadow">

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Produto</th>
              <th>Peso</th>
              <th>Preço</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td>{item.productName}</td>
                <td>{item.weight.toFixed(3).toString().replace(".", ",")} kg</td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(item.total)}</td>
                <td>
                  <button onClick={() => removeItem(i)}>
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <button
          onClick={handleFinish}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded text-lg"
        >
          Finalizar transação
        </button>
      </div>
      <ReceiptModal
        open={receiptOpen}
        onClose={handleCloseReceipt}
        transaction={lastTransaction}
        organizationName={organizationName}
        cpfCnpj={cpfCnpj}
      />
    </div>    
  )  
}