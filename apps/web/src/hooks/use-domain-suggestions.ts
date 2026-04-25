"use client"

import { useState } from "react"

export function useDomainSuggestions() {
  const [suggestions, setSuggestions] = useState<string[]>([])

  async function fetchSuggestions(name: string) {
    if (!name) return

    const base = name.toLowerCase().replace(/\s+/g, "")

    setSuggestions([
      `${base}.com`,
      `${base}.com.br`,
      `${base}.io`,
      `${base}.app`
    ])
  }

  return {
    suggestions,
    fetchSuggestions
  }
}