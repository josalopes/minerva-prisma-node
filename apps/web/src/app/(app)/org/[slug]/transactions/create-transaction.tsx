"use client"

import { useRef } from "react"
import { useTransaction } from "@/hooks/useTransaction"
// import { useTransaction } from "./useTransaction"

export function TransactionScreen({ products, transactionType }) {
  const {
    selectedProduct,
    weight,
    items,
    total,
    currentTotal,
    setProduct,
    setWeight,
    addItem,
    removeItem,
    finish
  } = useTransaction({ products, transactionType })

  const weightRef = useRef<HTMLInputElement>(null)

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">

      {/* 🔝 INPUT AREA */}
      <div className="bg-white p-4 rounded-xl shadow space-y-3">

        <div className="grid grid-cols-4 gap-3">

          {/* Produto */}
          <select
            className="border rounded p-2"
            onChange={(e) => {
              setProduct(e.target.value)
              setTimeout(() => weightRef.current?.focus(), 100)
            }}
          >
            <option value="">Selecione</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Preço */}
          <input
            className="border rounded p-2 bg-gray-100"
            value={selectedProduct?.price ?? ""}
            readOnly
          />

          {/* Peso */}
          <input
            ref={weightRef}
            type="number"
            step="0.01"
            placeholder="Peso (kg)"
            className="border rounded p-2"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") addItem()
            }}
          />

          {/* Total atual */}
          <div className="flex items-center justify-center font-bold">
            {currentTotal.toFixed(2)}
          </div>
        </div>

        <button
          onClick={addItem}
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
                <td>{item.weight} kg</td>
                <td>{item.unitPrice}</td>
                <td>{item.total.toFixed(2)}</td>
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
          <span>{total.toFixed(2)}</span>
        </div>

        <button
          onClick={finish}
          className="mt-4 w-full bg-green-600 text-white py-3 rounded text-lg"
        >
          Finalizar transação
        </button>
      </div>
    </div>
  )
}