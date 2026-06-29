"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button"

import { AddressForm } from "./address-form"
import { AddressCarousel } from "./address-carousel";
import { Address, OwnerType } from "@/types/address";
import { useDeleteAddress } from "./use-delete-address";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { useSetPrimaryAddress } from "./use-set-primary-address";

interface Props {
  ownerId: string
  ownerType: OwnerType
  addresses: Address[]
}

export function Addresses({
  ownerId,
  ownerType,
  addresses,
}: Props) {

  const router = useRouter()

  const deleteMutation = useDeleteAddress()
  
  const setPrimaryMutation = useSetPrimaryAddress()

  const [addressToDelete, setAddressToDelete] =
    useState<Address | null>(null)

  const [highlightId, setHighlightId] =
    useState<number>()
  
  const [selectedAddress, setSelectedAddress] =
    useState<Address | undefined>()

  const [creating, setCreating] =
    useState(false)

  function handleNewAddress() {
    setSelectedAddress(undefined)
    setCreating(true)
  }

  async function handleSuccess() {
    setCreating(false)
    setSelectedAddress(undefined)

    router.refresh()
  }

  function handleCancel() {
    setCreating(false)
    setSelectedAddress(undefined)

  }

  async function handleDelete() {

    if (!addressToDelete) return
  
    try {
      await deleteMutation.mutateAsync(
        addressToDelete.id
      )
    
      toast.success(
        "Endereço excluído."
      )
    
      setAddressToDelete(null)
      setSelectedAddress(undefined)

      router.refresh()
    } catch {
      toast.error(
        "Erro ao excluir endereço."
      )
    }
  }

  async function handleMakePrimary(address: Address) {
    try {
      await setPrimaryMutation.mutateAsync({
        id: address.id,
        ownerId: address.ownerId,
        ownerType: address.ownerType,
      })
  
      toast.success("Endereço definido como principal.")
  
      router.refresh()
    } catch (error) {
      console.error(error)
  
      toast.error(
        error instanceof Error
          ? error.message
          : "Não foi possível definir o endereço como principal."
      )
    }
  }

  return (
    <>
    
    <div className="space-y-6">
      <AddressCarousel
        addresses={addresses}
        selected={selectedAddress}
        highlightId={highlightId}
        onSelect={setSelectedAddress}
        onDelete={(address) => {
          setAddressToDelete(address)
        }}
        onMakePrimary={handleMakePrimary}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleNewAddress}
        >
          Novo endereço
        </Button>
      </div>

      {(creating || selectedAddress) && (
        <AddressForm
          ownerId={ownerId}
          ownerType={ownerType}
          address={selectedAddress}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
      <AlertDialog
        open={!!addressToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setAddressToDelete(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Excluir endereço?
            </AlertDialogTitle>

            <AlertDialogDescription>
                Tem certeza que deseja excluir o endereço
                <strong>
                {" "}
                {addressToDelete?.street},
                {" "}
                {addressToDelete?.number}
                </strong>
                ?
                Esta ação não poderá ser desfeita.
                </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>
                Cancelar
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
              >
                Excluir
              </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}