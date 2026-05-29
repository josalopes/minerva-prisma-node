import { prisma } from "@/lib/prisma"
import { applyTransactionStockService } from "./apply-transaction-stock"
import { revertTransactionStockService } from "./revert-transaction-stock"
import { fromMiligrams, toMiligrams } from "@/utils/weight"
import { fromCents } from "@/utils/money"

interface TransactionItemInput {
  productId: string
  quantity: number
}

interface CreateTransactionInput {
  items: TransactionItemInput[]
}

export async function updateTransactionService(
  transactionId: string,
  newItems: CreateTransactionInput["items"]
) {

  await prisma.$transaction(async (tx) => {

    const oldTransaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { transactionItems: true }
    })

    if (!oldTransaction) {
      throw new Error("Transação não encontrada")
    }

    // =========================
    // 🔥 1. REVERTER ESTOQUE ANTIGO
    // =========================
  await revertTransactionStockService(
    tx,
    oldTransaction
  )

    // =========================
    // 🔥 2. APAGAR ITENS ANTIGOS
    // =========================
    await tx.transactionItems.deleteMany({
      where: {
        transactionId
      }
    })

    // =========================
    // 🔥 3. CALCULAR NOVO TOTAL
    // =========================
    const productIds = newItems.map(i => i.productId)

    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
        organizationId: oldTransaction.organizationId,
        deletedAt: null
      },
      select: {
        id: true,
        price: true,
        stock: true
      }
    })

    // =========================
    // 🔥 MAPA DE PRODUTOS
    // =========================
    const productMap = new Map(
        products.map(p => [p.id, p])
    )

    // =========================
    // 🔥 MONTAR ITENS COM PREÇO REAL
    // =========================
    const itemsWithPrice = newItems.map(item => {
        const product = productMap.get(item.productId)!

        return {
        productId: item.productId,
        quantity: toMiligrams(item.quantity),
        value: product.price // 🔥 snapshot do preço
        }
    })


    const totalValue = itemsWithPrice.reduce(
        (acc, item) => acc + fromMiligrams(item.quantity) * fromCents(item.value),
        0
    )

    // =========================
    // 🔥 4. CRIAR NOVOS ITENS
    // =========================
    await tx.transactionItems.createMany({
      data: itemsWithPrice.map(item => ({
        transactionId,
        productId: item.productId,
        quantity: item.quantity,
        value: item.value
        // unitPrice: item.value
      }))
    })

    // =========================
    // 🔥 5. APLICAR NOVO ESTOQUE
    // =========================
    await applyTransactionStockService(
        tx,
        oldTransaction.transactionType,
        newItems
    )

    // =========================
    // 🔥 6. ATUALIZAR TRANSACTION
    // =========================
    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        totalValue
      }
    })
  })
}