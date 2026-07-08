"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  MoreVertical,
  Mail,
  RotateCcw,
  Trash2,
  UserCheck,
} from "lucide-react"

import clsx from "clsx"
import { motion } from "framer-motion"

export type Invite = {
  id: string
  name?: string
  email: string

  role:
    | "ADMIN"
    | "MEMBER"
    | "BILLING"
    | "CHECKIN"

  status:
    | "PENDING"
    | "ACCEPTED"
    | "EXPIRED"
    | "CANCELED"

  expiresAt: Date
  acceptedAt?: Date | null
}

interface InviteCardProps {
  invite: Invite
  selected?: boolean

  onClick?(
    invite: Invite
  ): void

  onResend?(
    invite: Invite
  ): void

  onDelete?(
    invite: Invite
  ): void
}

export function InviteCard({
  invite,
  selected = false,
  onClick,
  onResend,
  onDelete,
}: InviteCardProps) {

  const roleLabel = {
    ADMIN: "Administrador",
    MEMBER: "Membro",
    BILLING: "Financeiro",
    CHECKIN: "Check-in",
  }

  const statusVariant = {
    PENDING: "secondary",
    ACCEPTED: "default",
    EXPIRED: "destructive",
    CANCELED: "outline",
  } as const

  const statusLabel = {
    PENDING: "Pendente",
    ACCEPTED: "Aceito",
    EXPIRED: "Expirado",
    CANCELED: "Cancelado",
  }

  return (

    <motion.div
      layout
      whileHover={{
        y: -2,
      }}
      transition={{
        type: "spring",
        stiffness: 320,
        damping: 24,
      }}
    >

      <Card
        onClick={() => onClick?.(invite)}
        className={clsx(
          "cursor-pointer transition-all",

          selected
            ? `
              border-primary
              bg-primary/5
            `
            : `
              hover:border-primary/30
              hover:bg-muted/40
            `
        )}
      >

        <CardHeader className="flex flex-row items-start justify-between">

          <div>

            <CardTitle className="text-base">

              {invite.name || "Sem nome"}

            </CardTitle>

            <div
              className="
                mt-1
                flex
                items-center
                gap-2
                text-sm
                text-muted-foreground
              "
            >

              <Mail
                className="h-4 w-4"
              />

              {invite.email}

            </div>

          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

                <MoreVertical
                  size={16}
                />

              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
            >

              {invite.status ===
                "PENDING" && (

                <DropdownMenuItem
                  onClick={() =>
                    onResend?.(invite)
                  }
                >

                  <RotateCcw
                    className="mr-2 h-4 w-4"
                  />

                  Reenviar

                </DropdownMenuItem>

              )}

              {invite.status ===
                "ACCEPTED" && (

                <DropdownMenuItem>
                  <UserCheck
                    className="mr-2 h-4 w-4"
                  />

                  Membro ativo
                </DropdownMenuItem>

              )}

              <DropdownMenuItem
                className="
                  text-destructive
                "
                onClick={() =>
                  onDelete?.(invite)
                }
              >

                <Trash2
                  className="mr-2 h-4 w-4"
                />

                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div
            className="
              flex
              items-center
              justify-between
            "
          >

            <Badge
              variant="outline"
            >

              {roleLabel[
                invite.role
              ]}

            </Badge>

            <Badge
              variant={
                statusVariant[
                  invite.status
                ]
              }
            >

              {statusLabel[
                invite.status
              ]}

            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}