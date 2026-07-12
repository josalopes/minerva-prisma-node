'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { MoreVertical, Star, Trash } from 'lucide-react'
import clsx from 'clsx'
import { Address } from '@saas/contracts'

interface AddressCardProps {
  address: Address
  compact?: boolean
  selected?: boolean

  onClick?: (address: Address) => void
  onDelete?: (id: number) => void
  onMakePrimary?: (address: Address) => void
}

export function AddressCard({
  address,
  selected = false,
  compact = false,
  onClick,
  onDelete,
  onMakePrimary,
}: AddressCardProps) {
  const typeLabel = {
    GENERAL: 'Geral',
    BILLING: 'Cobrança',
    SHIPPING: 'Entrega',
  }

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      animate={{
        scale: selected ? 1.01 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 24,
      }}
      className="h-full py-2"
    >
      <Card
        onClick={() => onClick?.(address)}
        className={clsx(
          'relative h-full cursor-pointer border transition-all duration-300',

          selected
            ? `border-primary bg-primary/5`
            : `hover:border-primary/30 hover:bg-muted/30`,
        )}
      >
        {selected && (
          <div className="bg-primary absolute top-3 bottom-3 left-0 w-[3px] rounded-full" />
        )}

        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle
              className={clsx(
                'text-base transition-colors',
                selected && 'text-primary',
              )}
            >
              {address.street}, {address.number}
            </CardTitle>

            {address.isPrimary && (
              <Badge
                className="mt-2"
                variant={selected ? 'default' : 'secondary'}
              >
                Principal
              </Badge>
            )}
          </div>

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
              {!address.isPrimary && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    onMakePrimary?.(address)
                  }}
                >
                  <Star size={14} className="mr-2" />
                  Tornar principal
                </DropdownMenuItem>
              )}

              {onDelete && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDelete(address.id)
                    }}
                  >
                    <Trash size={14} className="mr-2" />
                    Excluir endereço...
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {!compact && (
          <CardContent className="space-y-1 text-sm">
            <p>{address.district}</p>

            <p>
              {address.city} - {address.state}
            </p>

            <p>CEP: {address.zipCode}</p>

            {address.type && (
              <Badge
                variant={selected ? 'default' : 'outline'}
                className="mt-2"
              >
                {typeLabel[address.type]}
              </Badge>
            )}
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
