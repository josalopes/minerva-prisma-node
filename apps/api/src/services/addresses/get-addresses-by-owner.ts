import { AddressOwnerType } from "@prisma/client"
import { addressRepository } from '../../repositories/address-repository'

export async function getAddressesByOwner(
  ownerType: AddressOwnerType,
  ownerId: string
) {
  const addresses = await addressRepository.findByOwner(
    ownerType,
    ownerId
  )

  return addresses
}