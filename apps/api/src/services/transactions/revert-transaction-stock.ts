import { Prisma } from "@prisma/client"

interface TransactionItem {
  productId: string
  quantity: number
}

interface TransactionWithItems {
  transactionItems: TransactionItem[]
  transactionType: "VENDA" | "COMPRA"
}


export async function revertTransactionStockService(
  tx: Prisma.TransactionClient,
  transaction: TransactionWithItems
) {

  for (const item of transaction.transactionItems) {

    const increment =
      transaction.transactionType === "VENDA"
        ? item.quantity
        : -item.quantity

    await tx.product.update({
      where: {
        id: item.productId
      },

      data: {
        stock: {
          increment
        }
      }
    })
  }
}