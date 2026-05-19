import { TransactionResponse } from "@/types/transaction"
import { Receipt } from "./receipt"

type ReceiptModalProps = {
  open: boolean
  onClose: () => void
  transaction: TransactionResponse | null
  organizationName: string
  cpfCnpj: string
}

export function ReceiptModal({ open, onClose, transaction, organizationName, cpfCnpj }: ReceiptModalProps) {
  if (!open || !transaction) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-white p-4 rounded-lg shadow-xl">
        <Receipt 
          transaction={transaction}
          organizationName={organizationName}
          cpfCnpj={cpfCnpj}
         />

        <div className="flex gap-2 mt-4">
          <button
            type='button' 
            onClick={() => {
              window.print()
              onClose()
            }}>
            Imprimir
          </button>

          <button 
            type='button' 
            onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}