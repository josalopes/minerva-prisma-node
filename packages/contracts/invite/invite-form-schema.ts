import { z } from "zod"

export const inviteFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe o nome.")
    .max(120),

  email: z
    .string()
    .trim()
    .email("E-mail inválido."),

  role: z.enum([
    "ADMIN",
    "MEMBER",
    "BILLING",
    "CHECKIN",
  ]),
})

export type InviteFormData =
  z.infer<typeof inviteFormSchema>
