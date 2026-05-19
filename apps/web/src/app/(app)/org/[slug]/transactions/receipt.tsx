"use client"

import { TransactionResponse } from "@/types/transaction"
import { formatCurrency, formatDate } from "@/utils/format"
import { formatCpfCnpj } from "@/utils/formata-cpf-cnpj"
import { QRCodeSVG } from "qrcode.react"

type ReceiptProps = {
  transaction: TransactionResponse
  organizationName: string
  cpfCnpj: string
}

export function Receipt({ transaction, organizationName, cpfCnpj }: ReceiptProps) {
  return (
    <div
      id="receipt"
      className="w-[300px] text-xs font-mono bg-white p-3 text-black"
    >
      {/* HEADER */}
      <div className="text-center">
        <p className="font-bold text-sm">{organizationName}</p>
        <p>CNPJ: {formatCpfCnpj(cpfCnpj)}</p>
        <p>-----------------------------</p>
      </div>

      {/* INFO */}
      <div className="mt-2">
        <p>ID: {transaction.id}</p>
        <p>{formatDate(transaction.date)}</p>
      </div>

      <p className="mt-2">-----------------------------</p>

      {/* ITEMS */}
      {transaction.transactionItems.map((item, i) => {
        const total = (item.weight / 1000) * item.unitPrice

        return (
          <div key={i} className="mb-1">
            <p>{item.productName}</p>

            <div className="flex justify-between">
              <span>
                {(item.weight / 1000).toFixed(3).replace(".", ",")}kg x{" "}
                {formatCurrency(item.unitPrice)}
              </span>

              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        )
      })}

      <p className="mt-2">-----------------------------</p>

      {/* TOTAL */}
      <div className="flex justify-between font-bold text-sm">
        <span>TOTAL</span>
        <span>{formatCurrency(transaction.totalValue / 100)}</span>
      </div>

      {/* QR CODE */}
      <div className="flex justify-center mt-3">
        <QRCodeSVG
          value={JSON.stringify({
            id: transaction.id,
            total: transaction.totalValue / 100
          })}
          size={80}
        />
      </div>

      {/* FOOTER */}
      <div className="text-center mt-2">
        <p>Obrigado pela preferência!</p>
      </div>
    </div>
  )
}
