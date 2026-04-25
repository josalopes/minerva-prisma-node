import z from "zod"

import {
  requiredString,
  cep,
  optionalBoolean,
  optionalString
} from "@/lib/validation-helpers"


export const createAddressFormSchema = z.object({
  type: requiredString("Tipo de endereço"),
  street: optionalString(),
  number: optionalString(),
  complement: optionalString(),
  district: optionalString(),
  city: optionalString(),
  state: optionalString(),
  zipCode: cep(),
  isPrimary: optionalBoolean(),
  isNew: optionalString(),
})

export type CreateAddressFormData =
  z.infer<typeof createAddressFormSchema>