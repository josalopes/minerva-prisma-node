import { prisma } from "@/lib/prisma"

import {
  CreateTransactionDTO,
  TransactionRepository
} from "../transaction-repository"

export class PrismaTransactionRepository
  implements TransactionRepository {

  async create(
    data: CreateTransactionDTO
  ) {

    const transaction =
      await prisma.transaction.create({
        data: {
          organizationId:
            data.organizationId,

          transactionType:
            data.transactionType,

          totalValue:
            data.totalValue,

          date: new Date(),
          userId: data.userId,

          transactionItems: {
            create: data.items
          }
        }
      })

    return {
      id: transaction.id
    }
  }

  async findById(id: string) {

    return prisma.transaction.findUnique({
      where: {
        id
      },

      include: {
        transactionItems: {
          include: {
            product: true
          }
        }
      }
    })
  }

  async cancel(id: string) {

    await prisma.transaction.update({
      where: {
        id
      },

      data: {
        deletedAt: new Date()
      }
    })
  }
}