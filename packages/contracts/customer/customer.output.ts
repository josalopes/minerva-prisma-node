import z from "zod";

import { customerEntitySchema } from "./customer.entity";

export const customerOutputSchema =
  customerEntitySchema

  export const customersListSchema = z.object({
  customers: z.array(
    customerEntitySchema
  )
})