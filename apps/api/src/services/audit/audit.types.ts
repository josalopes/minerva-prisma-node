import { Prisma } from "@prisma/client"

export enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  ACCEPT = "ACCEPT",
  REJECT = "REJECT",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  INVITE = "INVITE",
  }

  export enum AuditEntity {
    ORGANIZATION = "ORGANIZATION",
    INVITE = "INVITE",
    ADDRESS = "ADDRESS",
    MEMBER = "MEMBER",
    PRODUCT = "PRODUCT",
    CUSTOMER = "CUSTOMER",
    PROJECT = "PROJECT",
  }
  
export interface CreateAuditInput {
  organizationId?: string
  userId?: string
  entity: AuditEntity
  entityId?: string
  action: AuditAction
  description: string
  metadata?: Prisma.InputJsonValue
  ipAddress?: string
  userAgent?: string
}