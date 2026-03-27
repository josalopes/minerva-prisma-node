'use client'

import { Key, useEffect, useState } from 'react'
import { getAddresses } from '@/services/addresses/index'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatZipCode } from '@/utils/format-zip'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { SmartCarousel } from '@/components/ui/smart-carousel'
import { AddressCard } from '@/components/address/address-card'
import { CarouselKit } from '@/components/carousel-kit/carousel-kit'
import { CarouselKitDots } from '@/components/carousel-kit/carousel-kit-dots'
import { CarouselKitProvider } from '@/components/carousel-kit/carousel-kit.context'

interface Address {
  id: number
  street: string
  number: string
  complement: string
  district: string
  city: string
  state: string
  zipCode: string
  country: string
  isPrimary: boolean
}

// type Addresses = {
//         id: number
//         street: string
//         number: string
//         complement: string
//         district: string
//         city: string
//         state: string
//         zipCode: string
//         country: string
//         isPrimary: boolean
// }[];

interface Props {
  ownerType: string
  ownerId: string;  
}

export function AddressList({ ownerType, ownerId }: Props) {
  const [addresses, setAddresses] = useState<Address[]>([])

  async function load() {
    const data = await getAddresses(ownerType, ownerId)
    setAddresses(data)
  }

//   async function handleDelete(id: string) {
//     await deleteAddress(id)
//     load()
//   }


  useEffect(() => {
    load()
  }, [])

  return (
    <>
    {/* <CarouselKitProvider>

    </CarouselKitProvider> */}
      <CarouselKit
          items={addresses}
          snap="center"
          fade
          // autoplay
          gradient
          wheelScroll
          itemClassName="
          basis-full
          sm:basis-1/2
          md:basis-1/3
          lg:basis-1/4
          "
          renderItem={(address) => (
              <AddressCard address={address}
              onEdit={(id) => console.log("Editar", id)}
                  onDelete={(id) => console.log("Deletar", id)}
                  />
          )}
        />
      <CarouselKitDots />
    </>
  )
        
}