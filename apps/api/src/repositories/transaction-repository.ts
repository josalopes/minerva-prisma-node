import { TransactionType } from "@prisma/client"

export interface CreateTransactionItemDTO {
  productId: string
  quantity: number
  value: number
}

export interface CreateTransactionDTO {
  organizationId: string
  userId: string
  transactionType: TransactionType
  totalValue: number
  items: CreateTransactionItemDTO[]
}

export interface TransactionRepository {
  create(
    data: CreateTransactionDTO
  ): Promise<{
    id: string
  }>

  findById(
    id: string
  ): Promise<any>

  cancel(
    id: string
  ): Promise<void>
}