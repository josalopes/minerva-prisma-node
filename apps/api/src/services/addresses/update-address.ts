import { AddressType } from '@prisma/client'
import { addressRepository } from '../../repositories/address-repository'

interface UpdateAddressRequest {
  id: number
  // ownerType: string
  // ownerId: string
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  type?: AddressType
}

export async function updateAddressService(data: UpdateAddressRequest) {
  const { id, ...rest } = data

  const address = await addressRepository.update(id, rest)

  return address
}

// import { prisma } from "@/lib/prisma";

// interface UpdateAddressInput {
//   addressId: number;
//   street?: string;
//   complement?: string;
//   number?: string;
//   district?: string;
//   city?: string;
//   state?: string;
//   zipCode?: string;
// }

// export async function updateAddress(data: UpdateAddressInput) {
//   return prisma.address.update({
//     where: { id: data.addressId },
//     data: {
//       street: data.street,
//       number: data.number,
//       complement: data.complement,
//       district: data.district,
//       city: data.city,
//       state: data.state,
//       zipCode: data.zipCode,
//     },
//   });
// }