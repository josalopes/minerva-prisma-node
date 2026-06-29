"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { ReactNode, useEffect, useState } from "react"
import type { CarouselApi } from "@/components/ui/carousel"
import clsx from "clsx"
import { CarouselKitDots } from "./carousel-kit-dots"
import { CarouselKitProvider } from "./carousel-kit.context"
import { cn } from "@/lib/utils"

interface CarouselKitProps<T> {
  items: T[]
  renderItem: (item: T) => ReactNode

  itemClassName?: string

  snap?: "start" | "center"
  fade?: boolean
  autoplay?: boolean
  autoplayDelay?: number
  wheelScroll?: boolean
  gradient?: boolean

  showDots?: boolean
  showArrows?: boolean

  className?: string
  viewportPadding?: string
}

export function CarouselKit<T>({
  items,
  renderItem,
  itemClassName = "basis-full sm:basis-1/2 md:basis-1/3",
  snap = "start",
  fade = false,
  autoplay = false,
  autoplayDelay = 3000,
  wheelScroll = false,
  gradient = false,
  showDots = true,
  showArrows = true,
  className,
  viewportPadding = "px-4 py-2"
}: CarouselKitProps<T>) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Sync Embla
  useEffect(() => {
    if (!api) return

    const updateState = () => {
        setCurrent(api.selectedScrollSnap())
        setCount(api.scrollSnapList().length)
    }

    updateState()

    api.on("select", updateState)
    api.on("reInit", updateState)

    return () => {
        api.off("select", updateState)
        api.off("reInit", updateState)
    }
}, [api])

  // Autoplay
  useEffect(() => {
    if (!autoplay || !api) return

    const embla = api

    const interval = setInterval(() => {
      if (embla.canScrollNext()) embla.scrollNext()
      else embla.scrollTo(0)
    }, autoplayDelay)

    return () => clearInterval(interval)
  }, [api, autoplay, autoplayDelay])

  // Wheel Scroll
  useEffect(() => {
    if (!wheelScroll || !api) return

    const embla = api
    const node = embla.rootNode()

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()
        e.deltaY > 0 ? embla.scrollNext() : embla.scrollPrev()
      }
    }

    node.addEventListener("wheel", onWheel, { passive: false })

    return () => {
      node.removeEventListener("wheel", onWheel)
    }
  }, [api, wheelScroll])

  const hasOverflow = api?.canScrollNext() || api?.canScrollPrev() || false

  return (
    <CarouselKitProvider value={{ api, current, count }}>
      <div className={clsx("relative w-full cq-carousel", className)}>
        {gradient && (
          <>
            <div className="carousel-gradient-left" />
            <div className="carousel-gradient-right" />
          </>
        )}

        <Carousel
          setApi={setApi}
          opts={{
            align: snap,
            loop: false,
          }}
        >
          <CarouselContent
            className={cn(
                "-ml-4",
                viewportPadding
            )}
        >
            {items.map((item, index) => (
              <CarouselItem
                key={index}
                className={clsx(
                  "pl-4 carousel-item transition-opacity duration-500",
                  itemClassName,
                  fade &&
                    (current === index
                      ? "opacity-100"
                      : "opacity-40")
                )}
              >
                {renderItem(item)}
              </CarouselItem>
            ))}
          </CarouselContent>

          {hasOverflow && (
            <>
              <CarouselPrevious />
              <CarouselNext />
            </>
          )}
        </Carousel>

        {hasOverflow && <CarouselKitDots />}
      </div>
    </CarouselKitProvider>
  )
}
