"use client"

import { useMutation } from "@tanstack/react-query"

import {
  updateAddressAction
} from "@/http/address/actions"

export function useUpdateAddress() {
  return useMutation({
    mutationFn: updateAddressAction
  })
}

// "use client"

// import { useMutation } from "@tanstack/react-query"

// import {
//   updateAddress
// } from "@/http/address/update-address"

// import {
//   CreateAddressRequest
// } from "@/http/address/create-address"

// interface Props {
//   id: number
//   data: CreateAddressRequest
// }

// export function useUpdateAddress() {

//   return useMutation({

//     mutationFn: ({
//       id,
//       data
//     }: Props) => updateAddress(id, data)

//   })

// }