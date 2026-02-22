"use client"

import { useCarouselKit } from "./carousel-kit.context"
import clsx from "clsx"

export function CarouselKitDots() {
  const { api, current, count } = useCarouselKit()

  return (
    <div className="flex justify-center gap-2 mt-4">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          onClick={() => api?.scrollTo(index)}
          className={clsx(
            "h-2 rounded-full transition-all duration-300",
            current === index
              ? "bg-primary w-4"
              : "bg-muted w-2"
          )}
        />
      ))}
    </div>
  )
}