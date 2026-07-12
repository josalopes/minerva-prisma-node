'use client'
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
  return (
    <div className="space-y-2">
      {addresses.map((address) => (
        <div key={address.id} className="rounded border p-3">
          <div>
            {address.street}, {address.number}
          </div>
          <div>
            {address.city} - {address.state}
          </div>

          {address.isPrimary && <span>Principal</span>}
        </div>
      ))}
    </div>
  )
}
