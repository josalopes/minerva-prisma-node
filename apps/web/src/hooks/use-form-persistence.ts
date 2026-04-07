"use client"

import { useEffect } from "react"

export function useFormPersistence(key: string, data: any) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem(key, JSON.stringify(data))
    }, 500)

    return () => clearTimeout(timeout)
  }, [data, key])
}