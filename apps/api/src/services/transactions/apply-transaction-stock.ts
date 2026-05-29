import { Prisma } from "@prisma/client"

export async function applyTransactionStockService(
  tx: Prisma.TransactionClient,
  transactionType: "VENDA" | "COMPRA",
  items: {
    productId: string
    quantity: number
  }[]
) {

  for (const item of items) {

    const increment =
      transactionType === "COMPRA"
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