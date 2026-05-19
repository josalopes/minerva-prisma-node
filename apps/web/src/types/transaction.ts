export type TransactionItem = {
  productId: string
  productName: string
  weight: number
  unitPrice: number
}

export type TransactionResponse = {
  id: string
  totalValue: number
  date: string
  transactionItems: TransactionItem[]
}