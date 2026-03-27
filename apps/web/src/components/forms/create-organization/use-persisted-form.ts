// use-persisted-form.ts
"use client"

import { useEffect } from "react"

export function usePersistedForm(
  key: string,
  watch: any,
  setValue: any
) {

  useEffect(() => {
    const stored = localStorage.getItem(key)

    if (stored) {
      const values = JSON.parse(stored)

      Object.entries(values).forEach(([k, v]) =>
        setValue(k, v)
      )
    }
  }, [])

  useEffect(() => {
    const subscription = watch((value: any) => {
      localStorage.setItem(key, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [watch])
}