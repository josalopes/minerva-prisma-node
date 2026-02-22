import { addressRepository } from '../../repositories/address-repository'

export async function deleteAddress(id: number) {
  await addressRepository.delete(id)
}

