import { createLogger } from "@/lib/logger"
import { createAudit } from "./create-audit"
import { CreateAuditInput } from "./audit.types"
import { Prisma } from "@prisma/client"

const logger =
  createLogger("audit")

  export class AuditService {
    async create(
      data: CreateAuditInput,
      tx?: Prisma.TransactionClient,
    ) {
  
      const audit =
        await createAudit(data, tx)
  
      logger.info(
        {
          auditId: audit.id,
          entity: data.entity,
          action: data.action,
        },
        "Audit created"
      )
  
      return audit
  
    }
  }  

  export const audit = new AuditService()