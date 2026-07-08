import { prisma } from "@/lib/prisma"

import { CreateAuditInput } from "./audit.types"
import { Prisma } from "@prisma/client"

export async function createAudit(
  data: CreateAuditInput,
  tx?: Prisma.TransactionClient,
) {
  
  const db = tx ?? prisma

  return db.auditLog.create({
    data,
  })

}