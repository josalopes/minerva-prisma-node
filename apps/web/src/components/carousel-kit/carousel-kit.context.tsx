"use client"

import { createContext, useContext } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

interface CarouselKitContextValue {
  api?: CarouselApi
  current: number
  count: number
}

const CarouselKitContext =
  createContext<CarouselKitContextValue | null>(null)

export function CarouselKitProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: CarouselKitContextValue
}) {
  return (
    <CarouselKitContext.Provider value={value}>
      {children}
    </CarouselKitContext.Provider>
  )
}

export function useCarouselKit() {
  const context = useContext(CarouselKitContext)

  if (!context) {
    return {
      api: undefined,
      current: 0,
      count: 0,
    }
  }

  return context
}