import { AddressType } from '@prisma/client'
import { addressRepository } from '../../repositories/address-repository'
import { setPrimaryAddress } from './update-primary-address'
interface UpdateAddressRequest {
  id: number
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  isPrimary?: boolean
  type?: AddressType
}

export async function updateAddressService(data: UpdateAddressRequest) {
  const { id, ...rest } = data

  const address = await addressRepository.update(id, rest)

  setPrimaryAddress(address.ownerType, address.ownerId, address.id)

  return address
}