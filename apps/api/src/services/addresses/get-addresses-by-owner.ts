import { addressRepository } from '../../repositories/address-repository'

export async function getAddressesByOwner(
  ownerType: string,
  ownerId: string
) {
  const addresses = await addressRepository.findByOwner(
    ownerType,
    ownerId
  )

  return addresses
}