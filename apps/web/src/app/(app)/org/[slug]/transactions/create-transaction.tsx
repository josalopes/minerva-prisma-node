'use client'

import { useRef, useState } from 'react'
import { useTransaction } from '@/hooks/use-transaction'
import { ReceiptModal } from './receipt-modal'
import { TransactionResponse } from '@/types/transaction'
import { useCreateTransaction } from './use-create-transaction'
import { ProductSearch } from './product-search'
import { formatCurrency } from '@/utils/format'

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
  transactionType: 'COMPRA' | 'VENDA'
}

export function TransactionScreen({
  slug,
  products,
  transactionType,
  organizationName,
  cpfCnpj,
}: Props) {
  const {
    selectedProduct,
    items,
    total,
    currentTotal,
    weightInput,
    setProduct,
    addItem,
    removeItem,
    reset,
  } = useTransaction({ products, transactionType })
  const productSearchRef = useRef<HTMLInputElement>(null)

  const weightRef = useRef<HTMLInputElement>(null)
  const mutation = useCreateTransaction()

  const [receiptOpen, setReceiptOpen] = useState(false)
  const [lastTransaction, setLastTransaction] =
    useState<TransactionResponse | null>(null)

  async function handleFinish() {
    try {
      const data = await mutation.mutateAsync({
        slug,
        transactionType,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.weight,
        })),
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
    <div className="mx-auto max-w-4xl space-y-4 p-4">
      {/* 🔝 INPUT AREA */}
      <div className="space-y-3 rounded-xl bg-white p-4 shadow">
        <div className="grid grid-cols-4 gap-3">
          {/* Produto */}
          <div className="col-span-4">
            <ProductSearch
              ref={productSearchRef}
              products={products}
              onSelect={(product) => {
                setProduct(product.id)

                setTimeout(() => {
                  weightRef.current?.focus()
                }, 50)
              }}
            />
          </div>

          <input
            className="col-span-2 rounded border bg-gray-100 p-2"
            value={selectedProduct?.name ?? ''}
            readOnly
          />

          {/* Preço */}
          <input
            className="col-span-2 rounded border bg-gray-100 p-2"
            value={formatCurrency(selectedProduct?.price ?? 0)}
            readOnly
          />

          {/* Peso */}
          <input
            ref={weightRef}
            type="text"
            inputMode="decimal"
            placeholder="0,000 kg"
            className="col-span-2 h-14 rounded-lg border px-4 text-lg"
            value={weightInput.value}
            onChange={weightInput.onChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAddItem()
              }
            }}
          />

          {/* Total atual */}
          <div className="col-span-2 flex items-center justify-center font-bold">
            {formatCurrency(currentTotal)}
          </div>
        </div>

        <button
          onClick={handleAddItem}
          className="w-full rounded bg-blue-600 py-2 text-white"
        >
          Adicionar item
        </button>
      </div>

      {/* 📋 ITEMS */}
      <div className="rounded-xl bg-white p-4 shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
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
                <td>
                  {item.weight.toFixed(3).toString().replace('.', ',')} kg
                </td>
                <td>{formatCurrency(item.unitPrice)}</td>
                <td>{formatCurrency(item.total)}</td>
                <td>
                  <button onClick={() => removeItem(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>

        <button
          onClick={handleFinish}
          className="mt-4 w-full rounded bg-green-600 py-3 text-lg text-white"
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
