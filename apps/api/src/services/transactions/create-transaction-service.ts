import { prisma } from "@/lib/prisma"
import { BadRequestError } from "@/http/routes/-errors/bad-request-error"
import { fromMiligrams, toMiligrams } from "@/utils/weight"
import { fromCents, toCents } from "@/utils/money"

interface TransactionItemInput {
  productId: string
  quantity: number
}

interface CreateTransactionInput {
  items: TransactionItemInput[]
  transactionType: "VENDA" | "COMPRA"
  cpfCnpj?: string | null | undefined
}

interface CreateTransactionParams {
  organizationId: string
  userId: string
}

export async function createTransactionService(
  data: CreateTransactionInput,
  params: CreateTransactionParams
) {

  return await prisma.$transaction(async (tx) => {

    // =========================
    // 🔥 VALIDAR INPUT
    // =========================
    if (!data.items.length) {
      throw new BadRequestError("A transação deve ter ao menos 1 item")
    }

    // =========================
    // 🔥 BUSCAR PRODUTOS
    // =========================
    const productIds = data.items.map(i => i.productId)

    const products = await tx.product.findMany({
      where: {
        id: { in: productIds },
        organizationId: params.organizationId,
        deletedAt: null
      },
      select: {
        id: true,
        price: true,
        stock: true
      }
    })

    // =========================
    // 🔥 VALIDAR EXISTÊNCIA
    // =========================
    if (products.length !== productIds.length) {
      throw new BadRequestError("Um ou mais produtos são inválidos")
    }

    // =========================
    // 🔥 MAPA DE PRODUTOS
    // =========================
    const productMap = new Map(
      products.map(p => [p.id, p])
    )

    // =========================
    // 🔥 MONTAR ITENS COM PREÇO REAL
    // =========================
    const itemsWithPrice = data.items.map(item => {
      const product = productMap.get(item.productId)!

      return {
        productId: item.productId,
        quantity: toMiligrams(item.quantity),
        value: product.price // 🔥 snapshot do preço
      }
    })

    // =========================
    // 🔥 VALIDAR ESTOQUE (ANTES)
    // =========================
    if (data.transactionType === "VENDA") {

      for (const item of itemsWithPrice) {

        const product = productMap.get(item.productId)!

        if (product.stock < item.quantity) {
          throw new BadRequestError(
            `Estoque insuficiente para o produto ${item.productId}`
          )
        }
      }
    }

    // =========================
    // 🔥 CALCULAR TOTAL
    // =========================
    const totalValue = itemsWithPrice.reduce(
      (acc, item) => acc + fromMiligrams(item.quantity) * fromCents(item.value),
      0
    )

    // =========================
    // 🔥 CRIAR TRANSACTION + ITEMS
    // =========================
    const transaction = await tx.transaction.create({
      data: {
        date: new Date(),
        transactionType: data.transactionType,
        totalValue: toCents(totalValue),

        organizationId: params.organizationId,
        userId: params.userId,
        cpfCnpj: data.cpfCnpj ?? null,

        transactionItems: {
          create: itemsWithPrice
        }
      },
      select: {
        id: true,
        totalValue: true,
        date: true,
        transactionItems: {
          select: {
            productId: true,
            quantity: true,
            value: true,
            product: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // =========================
    // 🔥 ATUALIZAR ESTOQUE
    // =========================
    for (const item of itemsWithPrice) {

      const increment =
        data.transactionType === "COMPRA"
          ? item.quantity
          : -item.quantity

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment
          }
        }
      })
    }

    // =========================
    // 🔥 RETORNO
    // =========================
    return transaction

  })
}

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

    for (const item of transaction.transactionItems) {

      const increment =
        transaction.transactionType === "VENDA"
          ? item.quantity
          : -item.quantity

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment
          }
        }
      })
    }

    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        deletedAt: new Date(),
        status: "CANCELED"
      }
    })
  })
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
    for (const item of oldTransaction.transactionItems) {

      const increment =
        oldTransaction.transactionType === "VENDA"
          ? item.quantity
          : -item.quantity

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment
          }
        }
      })
    }

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
    const totalValue = newItems.reduce(
      (acc, i) => acc + i.quantity * i.price,
      0
    )

    // =========================
    // 🔥 4. CRIAR NOVOS ITENS
    // =========================
    await tx.transactionItems.createMany({
      data: newItems.map(item => ({
        transactionId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price
      }))
    })

    // =========================
    // 🔥 5. APLICAR NOVO ESTOQUE
    // =========================
    for (const item of newItems) {

      const increment =
        oldTransaction.transactionType === "COMPRA"
          ? item.quantity
          : -item.quantity

      const updated = await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment
          }
        }
      })

      if (updated.stock < 0) {
        throw new Error("Estoque insuficiente")
      }
    }

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

// ****** Relatório de vendas **************
// EXEMPLO
// const sales = await prisma.transaction.findMany({
//   where: {
//     organizationId,
//     deletedAt: null,
//     transactionType: "VENDA",
//   },

//   include: {
//     transactionItems: {
//       select: {
//         productId: true,
//         quantity: true,
//         value: true
//       }
//     }
//   }
// })

// TOTAL GERAL
// const totalRevenue = sales.reduce(
//   (acc, t) => acc + t.totalValue,
//   0
// )

// TOTAL POR PRODUTO
// const productMap = new Map<string, number>()

// for (const t of sales) {
//   for (const item of t.transactionItems) {
//     const total = item.quantity * item.value

//     productMap.set(
//       item.productId,
//       (productMap.get(item.productId) ?? 0) + total
//     )
//   }
// }

// DASHBOARD (MÉTRICAS IMPORTANTES)

// QUERY BASE
// const transactions = await prisma.transaction.findMany({
//   where: {
//     organizationId,
//     deletedAt: null,
//     transactionType: "VENDA",
//     date: {
//       gte: startDate,
//       lte: endDate
//     }
//   },
//   include: {
//     transactionItems: true
//   }
// })

// CÁLCULOS
// faturamento
// const revenue = transactions.reduce(
//   (acc, t) => acc + t.totalValue,
//   0
// )

// número de vendas
// const totalSales = transactions.length

// ticket médio
// const avgTicket =
//   totalSales > 0 ? revenue / totalSales : 0

// produtos mais vendidos
// const productCount = new Map<string, number>()

// for (const t of transactions) {
//   for (const item of t.transactionItems) {
//     productCount.set(
//       item.productId,
//       (productCount.get(item.productId) ?? 0) + item.quantity
//     )
//   }
// }


// RECONSTRUÇÃO DO ESTOQUE (AUDITORIA)
// IMPLEMENTAÇÃO
export async function rebuildStock(organizationId: string) {

  const transactions = await prisma.transaction.findMany({
    where: {
      organizationId,
      deletedAt: null
    },
    include: {
      transactionItems: true
    },
    orderBy: {
      date: "asc"
    }
  })

  const stockMap = new Map<string, number>()

  for (const t of transactions) {
    for (const item of t.transactionItems) {

      const current = stockMap.get(item.productId) ?? 0

      const delta =
        t.transactionType === "COMPRA"
          ? item.quantity
          : -item.quantity

      stockMap.set(
        item.productId,
        current + delta
      )
    }
  }

  // 🔥 persistir no banco
  await Promise.all(
    Array.from(stockMap.entries()).map(([productId, stock]) =>
      prisma.product.update({
        where: { id: productId },
        data: { stock }
      })
    )
  )
}

// TABELA DE LOG
// model StockMovement {
//   id String @id @default(uuid())

//   productId String
//   quantity Int

//   type String // IN | OUT

//   referenceId String // transactionId

//   createdAt DateTime @default(now())
// }

// PRÓXIMOS PASSOS:
// custo médio ponderado
// 👉 margem de lucro automática
// 👉 DRE simplificado
// 👉 multi-estoque (depósitos)
// 👉 controle por lote


