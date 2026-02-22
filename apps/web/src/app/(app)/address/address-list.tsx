'use client'

import { useEffect, useState } from 'react'
import {
  getAddresses,
  // deleteAddress,
} from '@/services/addresses'

interface Address {
  id: number
  street: string
  number: string
  district: string
  city: string
  state: string
  zipCode: string
  country: string
  isPrimary: boolean
}

interface Props {
  addresses: Address[]
}

export function AddressList({ addresses }: Props) {
  // const [addresses, setAddresses] = useState<Address[]>([])

  // async function load() {
  //   const data = await getAddresses(ownerType, ownerId)
  //   setAddresses(data)
  // }

  // async function handleDelete(id: string) {
  //   await deleteAddress(id)
  //   load()
  // }

  // useEffect(() => {
  //   load()
  // }, [])

  return (
    <div className="space-y-2">
      {addresses.map((address) => (
        <div
          key={address.id}
          className="border p-3 rounded"
        >
          <div>
            {address.street}, {address.number}
          </div>
          <div>
            {address.city} - {address.state}
          </div>

          {address.isPrimary && (
            <span>Principal</span>
          )}

          {/* <button onClick={() => handleDelete(address.id)}>
            Excluir
          </button> */}
        </div>
      ))}
    </div>
  )
}