"use client"

import { useMemo, useState } from "react"

function formatWeight(value: string) {
  value = value.replace(/\D/g, "")

  if (!value) return ""

  value = (parseInt(value, 10) / 1000)
    .toFixed(3)

  value = value.replace(".", ",")

  value = value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  )

  return value
}

function parseWeight(value: string) {

  if (!value) return 0

  return Number(
    value
      .replace(/\./g, "")
      .replace(",", ".")
  )
}

export function useMaskWeightInput(
  initialValue = ""
) {

  const [value, setValue] =
    useState(initialValue)

  function onChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setValue(
      formatWeight(e.target.value)
    )
  }

  function reset() {
    setValue("")
  }

  function setRawValue(raw: number) {

    const formatted =
      formatWeight(
        String(
          Math.round(raw * 1000)
        )
      )

    setValue(formatted)
  }

  const parsedValue = useMemo(() => {
    return parseWeight(value)
  }, [value])

  return {
    value,
    parsedValue,
    onChange,
    reset,
    setRawValue,
    setValue
  }
}