import { useEffect } from "react"

export function useScrollOnStep(step: number) {
  useEffect(() => {
    const el = document.querySelector("[data-scroll-container]")

    if (el) {
      el.scrollTo({ top: 0, behavior: "smooth" })
    }
  }, [step])
}