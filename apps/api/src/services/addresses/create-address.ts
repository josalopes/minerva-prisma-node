import { addressRepository } from '../../repositories/address-repository'

interface CreateAddressRequest {
  ownerType: string
  ownerId: string
  street?: string
  number?: string
  complement?: string
  district?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  type?: string
}

export async function createAddress(data: CreateAddressRequest) {
  console.log(data)
  const address = await addressRepository.create({
    ...data,
    country: data.country ?? 'BR',
  })

  return address
}

// import { prisma } from "@/lib/prisma";
// import { CreateAddressInput } from "./types";

// export async function createAddress(data: CreateAddressInput) {
//   const ownerField =
//     data.ownerType === "organization"
//       ? { organizationId: data.ownerId }
//       : { memberId: data.ownerId };

//   const address = await prisma.address.create({
//     data: {
//       ownerType: data.ownerType,
//       ownerId: data.ownerId,
//       street: data.street,
//       complement: data.complement,
//       number: data.number,
//       district: data.district,
//       city: data.city,
//       state: data.state,
//       zipCode: data.zipCode,
//       ...ownerField,
//     },
//   });

//   return address;
// }