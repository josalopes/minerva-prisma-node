'use client'

// import { useEffect, useState } from 'react'
// import { AddressForm } from './address-form'
// import { AddressList } from './address-list'
// import { AddressForm } from '@/components/forms/address-form'
// import { AddressList } from '@/components/address/address-list'
import { getAddresses } from '@/http/address/get-addresses'
// import { getAddresses } from '@/services/addresses'

// interface Address {
//   id: number
//   street: string
//   number: string
//   district: string
//   city: string
//   state: string
//   zipCode: string
//   country: string
//   isPrimary: boolean
// }

// interface Props {
//   organization: {
//     id: string
//   }
// }

// export default async function OrganizationAddresses({ organization }: Props) {
//   const [addresses, setAddresses] = useState<Address[]>([])

//   async function reload() {
//     const data = await getAddresses('organization', organization.id)
//     setAddresses(data.addresses)
//   }

//   useEffect(() => {
//     reload()
//   }, [])

//   return (
//     <div className="space-y-6">
//       <AddressForm
//         ownerType="organization"
//         ownerId="8c3026ab-8cc6-484b-ba2d-aebcf5bb7970"
        // ownerId={organization.id}
//         onSuccess={reload}
//       />

//       <AddressList
//         // ownerType="organization"
//         // ownerId={organization.id}
//         addresses={addresses}
//       />
//     </div>
//   )
// }


// import { ability, auth } from "@/auth/auth"
// import { cookies } from "next/headers";
// import { AddressForm } from "./address-form";

// export default async function Profile() {
//   const { user } = await auth()
//   const permissions = await ability()
//   const slug = (await cookies()).get('current-org')?.value

//   return (
//     <div className="space-y-4">
//         {/* {permissions?.can('create', 'Project') && ( */}
//             <AddressForm 
//                 ownerType="organization"
//                 ownerId="8c3026ab-8cc6-484b-ba2d-aebcf5bb7970"
//                 // ownerId={organization.id}
//                 onSuccess={reload}
//               />
//         {/* )} */}
//     </div>
//   )
// }
