import { prisma } from "@/lib/prisma"

import crypto from "crypto"

import { CreateInviteInput } from "@saas/contracts/invite"
import { mailService } from "../mail/mail.service"
import { createLogger } from "@/lib/logger"
import { audit, AuditAction, AuditEntity } from "../audit"
import { RequestContext } from "@/http/request-context"

export async function createInviteService(
  data: CreateInviteInput,
  invitedById: string,
  context?: RequestContext
) {

  const logger =
    createLogger("invite")

  const alreadyExists =
    await prisma.invite.findFirst({
      where: {
        organizationId: data.organizationId,
        email: data.email,
        acceptedAt: null,
      },
    })

  if (alreadyExists) {
    throw new Error(
      "Já existe um convite pendente para este e-mail."
    )
  }

  const token =
  crypto.randomBytes(32).toString("hex")

  const invite =
    await prisma.invite.create({
      data: {
        ...data,
        invitedById,
        token: token,        
        expiresAt:
          new Date(
            Date.now() +
            1000 * 60 * 60 * 24 * 7
          ),
      },
    })

  await mailService.sendInvite({
    to: invite.email,
    organization: data.organizationId,
    invitedBy: invitedById,
    role: invite.role,
    token: invite.token
  })

  logger.info(
    {
      inviteId: invite.id,
      email: invite.email,
      organizationId: data.organizationId,
    },
    "Invite created"
  )

  await audit.create(
    {
      organizationId: data.organizationId,
      userId: invitedById,
      entity: AuditEntity.INVITE,
      entityId: invite.id,
      action: AuditAction.CREATE,
      description: `Convite enviado para ${invite.email}.`,
      metadata: {
        role: invite.role,
      },
      ipAddress: context?.ipAddress,
      userAgent: context?.userAgent
    },
    tx,
  )

  return invite
}