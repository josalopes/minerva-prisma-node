import { addressRepository } from '../../repositories/address-repository'

export async function deleteAddressService(id: number) {
  await addressRepository.delete(id)
}

