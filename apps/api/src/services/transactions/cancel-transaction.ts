import { prisma } from "@/lib/prisma"
import { revertTransactionStockService } from "./revert-transaction-stock"

export async function cancelTransactionService(transactionId: string) {

  await prisma.$transaction(async (tx) => {

    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: {
        transactionItems: true
      }
    })

    if (!transaction) {
      throw new Error("Transação não encontrada")
    }

    if (transaction.deletedAt) {
      throw new Error("Transação já cancelada")
    }

    await revertTransactionStockService(tx, transaction)

    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        deletedAt: new Date(),
        status: "CANCELED"
      }
    })
  })
}