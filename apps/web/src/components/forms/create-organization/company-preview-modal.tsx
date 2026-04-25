"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { CnpjData } from "@/types/cnpj"

type Props = {
  open: boolean
  data: CnpjData | null
  isLoading: boolean
  onApply: (data: CnpjData) => void
  onClose: () => void
}

export function CompanyPreviewModal({
  open,
  data,
  isLoading,
  onApply,
  onClose
}: Props) {
  return (
    <Dialog open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Dados da empresa encontrados</DialogTitle>
        </DialogHeader>

        {/* ========================= */}
        {/* 🔥 LOADING */}
        {/* ========================= */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        )}

        {/* ========================= */}
        {/* 🔥 DATA */}
        {/* ========================= */}
        {!isLoading && data && (
          <div className="space-y-4 text-sm">

            {/* Empresa */}
            <div>
              <p className="font-medium text-base">
                {data.name}
              </p>

              {data.tradeName && (
                <p className="text-muted-foreground">
                  {data.tradeName}
                </p>
              )}
            </div>

            {/* Contato */}
            {(data.email || data.phone) && (
              <div className="space-y-1">
                {data.email && (
                  <p>Email: {data.email}</p>
                )}
                {data.phone && (
                  <p>Telefone: {data.phone}</p>
                )}
              </div>
            )}

            {/* Endereço */}
            <div className="space-y-1">
              <p className="font-medium">Endereço</p>

              <p>
                {data.address?.street} {data.address?.number}
              </p>

              {data.address?.complement && (
                <p>{data.address.complement}</p>
              )}

              <p>
                {data.address?.district}
              </p>

              <p>
                {data.address?.city} - {data.address?.state}
              </p>

              <p>
                CEP: {data.address?.zipCode}
              </p>
            </div>
          </div>
        )}

        {/* ========================= */}
        {/* 🔥 FOOTER */}
        {/* ========================= */}
        <DialogFooter className="mt-4">

          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => data && onApply(data)}
            disabled={!data || isLoading}
          >
            Usar dados
          </Button>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
