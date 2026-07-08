'use client'

import { AddressCard } from '@/components/address/address-card'
import { CarouselKit } from '@/components/carousel-kit/carousel-kit'
import { CarouselKitDots } from '@/components/carousel-kit/carousel-kit-dots'
import { Address } from '@saas/contracts'

interface Props {
  addresses: Address[]
  selected?: Address
  highlightId?: number

  onSelect(address: Address): void
  onDelete?(address: Address): void
  onMakePrimary?(address: Address): void
}

export function AddressCarousel({
  addresses,
  selected,
  highlightId,
  onSelect,
  onMakePrimary,
  onDelete,
}: Props) {
  return (
    <>
      <CarouselKit
        items={addresses}
        snap="center"
        fade
        gradient
        wheelScroll
        itemClassName="
          basis-full
          sm:basis-1/2
          md:basis-1/3
          lg:basis-1/4
        "
        renderItem={(address) => (
          <AddressCard
            address={address}
            highlight={highlightId === address.id}
            selected={selected?.id === address.id}
            onClick={onSelect}
            onMakePrimary={onMakePrimary}
            onDelete={(id) => onDelete?.(address)}
          />
        )}
      />

      <CarouselKitDots />
    </>
  )
}
