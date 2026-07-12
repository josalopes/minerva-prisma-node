'use client'

import { useEffect } from 'react'

import {
  FieldValues,
  UseFormSetValue,
  UseFormWatch,
  Path,
} from 'react-hook-form'

export function usePersistedForm<T extends FieldValues>(
  key: string,
  watch: UseFormWatch<T>,
  setValue: UseFormSetValue<T>,
) {
  useEffect(() => {
    const stored = localStorage.getItem(key)

    if (stored) {
      const values = JSON.parse(stored) as Partial<T>

      Object.entries(values).forEach(([k, v]) => setValue(k as Path<T>, v))
    }
  }, [key, setValue])

  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem(key, JSON.stringify(value))
    })

    return () => subscription.unsubscribe()
  }, [watch, key])
}
