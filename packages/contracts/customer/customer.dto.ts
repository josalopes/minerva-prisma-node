import z from "zod"

import { customerEntitySchema } from "./customer.entity"
import { createCustomerSchema, updateCustomerSchema } from "./customer.input"

export type CreateCustomerInput =
  z.infer<typeof createCustomerSchema>

export type UpdateCustomerInput =
  z.infer<typeof updateCustomerSchema>

export type Customer =
  z.infer<typeof customerEntitySchema>