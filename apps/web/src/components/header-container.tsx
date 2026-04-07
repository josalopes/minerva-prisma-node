"use client"

import { useEffect, useState } from "react"
import clsx from "clsx"

export function HeaderContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const scrollContainer = document.querySelector(
      "[data-scroll-container]"
    )

    if (!scrollContainer) return

    const handleScroll = () => {
      setScrolled(scrollContainer.scrollTop > 10)
    }

    scrollContainer.addEventListener("scroll", handleScroll)

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div
      className={clsx(
        "sticky top-0 z-50 w-full shrink-0 transition-all duration-200",
        "border-b",

        // base
        "bg-background/70 backdrop-blur-md",

        // efeito ao scroll
        scrolled && "shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
        // scrolled && "shadow-md"
      )}
    >
      {children}
    </div>
  )
}