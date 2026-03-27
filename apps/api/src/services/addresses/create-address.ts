import { prisma } from '@/lib/prisma'
import { Address, AddressType } from '@prisma/client'

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
  isPrimary?: boolean
  type?: AddressType
}
interface CreateAddressResponse {
  id: number;
  ownerType: string;
  ownerId: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  type: AddressType;
  // organizationId: string | null;
  // memberId: string | null;
  // customerId: string | null;
  isPrimary: boolean;
}

export async function createAddressService(data: CreateAddressRequest): Promise<CreateAddressResponse> {
  const ownerField =
   data.ownerType === "organization"
     ? { organizationId: data.ownerId }
     : { memberId: data.ownerId };

  const address = await prisma.address.create({
    data: {
      street: data.street,
      number: data.number,
      complement: data.complement,
      district: data.district,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      isPrimary: data.isPrimary,
      ownerId: data.ownerId,
      ownerType: data.ownerType,
      type: data.type,
      country: data.country ?? 'BR',
      ...ownerField
    },
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