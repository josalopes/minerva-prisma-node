"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Pencil, Trash } from "lucide-react"

export interface Address {
  id: number
  street: string
  number: string
  complement?: string
  district: string
  city: string
  state: string
  zipCode: string
  isPrimary?: boolean
  type?: "GENERAL" | "BILLING" | "SHIPPING"
}

interface AddressCardProps {
  address: Address
  compact?: boolean
  onClick?: (id: number) => void
  onEdit?: (address: Address) => void
  onDelete?: (id: number) => void
}

export function AddressCard({
  address,
  compact = false,
  onClick,
  onEdit,
  onDelete,
}: AddressCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localStreet, setLocalStreet] = useState(address.street)

  const typeLabel = {
    GENERAL: "Geral",
    BILLING: "Cobrança",
    SHIPPING: "Entrega",
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card
        onClick={() => onClick?.(address.id)}
        className="h-full cursor-pointer transition-shadow hover:shadow-xl"
      >
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            {isEditing ? (
              <input
                value={localStreet}
                onChange={(e) => setLocalStreet(e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              />
            ) : (
              <CardTitle className="text-base">
                {localStreet}, {address.number}
              </CardTitle>
            )}

            {address.isPrimary && (
              <Badge className="mt-1" variant="secondary">
                Principal
              </Badge>
            )}
          </div>

          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsEditing(true)
                      onEdit(address)
                    }}
                  >
                    <Pencil size={14} className="mr-2" />
                    Editar
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(address.id)
                    }}
                  >
                    <Trash size={14} className="mr-2" />
                    Excluir
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        {!compact && (
          <CardContent className="text-sm space-y-1">
            <p>{address.district}</p>
            <p>
              {address.city} - {address.state}
            </p>
            <p>CEP: {address.zipCode}</p>

            {address.type && (
              <Badge variant="outline" className="mt-2">
                {typeLabel[address.type]}
              </Badge>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}