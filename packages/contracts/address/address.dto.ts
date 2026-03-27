import z from "zod"

import { addressEntitySchema } from "./address.entity"
import { createAddressSchema, updateAddressSchema } from "./address.input"

export type CreateAdreessInput =
  z.infer<typeof createAddressSchema>

export type UpdateAdreessInput =
  z.infer<typeof updateAddressSchema>

export type Adreess =
  z.infer<typeof addressEntitySchema>