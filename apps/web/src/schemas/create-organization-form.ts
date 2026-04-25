import { z } from "zod"

import {
  requiredString,
  requiredEnum,
  cpfCnpj,
  domain,
  cep,
  optionalBoolean,
  optionalString
} from "@/lib/validation-helpers"

export const createOrganizationFormSchema = z.object({
  name: requiredString("Nome"),
  cpfCnpj: cpfCnpj(),
  personType: requiredEnum(
      ["FISICA", "JURIDICA"],
      "Selecione o tipo de pessoa"
    ),
  domain: optionalString(), 
  shouldAttachUserByDomain: optionalBoolean(),

  
})

export type CreateOrganizationFormData =
  z.infer<typeof createOrganizationFormSchema>