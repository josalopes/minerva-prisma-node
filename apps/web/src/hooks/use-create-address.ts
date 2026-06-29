"use client"

import { useMutation } from "@tanstack/react-query"

import {
  createAddressAction
} from "@/http/address/actions"

export function useCreateAddress() {
  return useMutation({
    mutationFn: createAddressAction
  })
}

// "use client"

// import { useMutation } from "@tanstack/react-query"

// import {
//   createAddress,
//   CreateAddressRequest
// } from "@/http/address/create-address"

// export function useCreateAddress() {
//   return useMutation({
//     mutationFn: (
//       data: CreateAddressRequest
//     ) => createAddress(data)

//   })

// }