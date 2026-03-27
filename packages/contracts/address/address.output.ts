import z from "zod";

import { addressEntitySchema } from "./address.entity";

export const addressOutputSchema =
  addressEntitySchema

  export const addressListSchema = z.object({
  addresses: z.array(
    addressEntitySchema
  )
})