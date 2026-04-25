"use client"

import { useEffect, useRef } from "react"
import { FieldValues, UseFormReturn, Path } from "react-hook-form"

export function useFocusFirstError<T extends FieldValues>(
  form: UseFormReturn<T>,
  step?: number
) {
  const hasFocused = useRef(false)

  useEffect(() => {
    hasFocused.current = false
  }, [step])

  useEffect(() => {
    if (hasFocused.current) return

    const errors = form.formState.errors

    if (!errors || Object.keys(errors).length === 0) return

    const firstError = Object.keys(errors)[0] as Path<T>

    const el = document.querySelector(
      `[name="${String(firstError)}"]`
    ) as HTMLElement | null

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center"
      })
    }

    form.setFocus(firstError, {
      shouldSelect: true
    })

    hasFocused.current = true
  }, [form.formState.errors])
}

// 'use client'

// import { useEffect, useRef } from "react"
// import { FieldValues, UseFormReturn, Path } from "react-hook-form"

// export function useFocusFirstError<T extends FieldValues>(
//   form: UseFormReturn<T>,
//   step?: number
// ) {
//   const hasFocused = useRef(false)

//   // reset ao mudar de step
//   useEffect(() => {
//     hasFocused.current = false
//   }, [step])

//   useEffect(() => {
//     if (hasFocused.current) return

//     const errors = form.formState.errors

//     if (!errors || Object.keys(errors).length === 0) return

//     const firstError = Object.keys(errors)[0] as Path<T>

//     form.setFocus(firstError, {
//       shouldSelect: true
//     })

//     hasFocused.current = true

//   }, [form.formState.errors])
// }

