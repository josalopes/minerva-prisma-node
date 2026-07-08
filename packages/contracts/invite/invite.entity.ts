import { z } from "zod"

export const inviteStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "EXPIRED",
  "CANCELED",
])

export type InviteStatus =
  z.infer<typeof inviteStatusSchema>

export const inviteRoleSchema = z.enum([
  "ADMIN",
  "MEMBER",
  "BILLING",
  "CHECKIN",
])

export type InviteRole =
  z.infer<typeof inviteRoleSchema>

export const inviteEntitySchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  role: inviteRoleSchema,
  status: inviteStatusSchema,
  expiresAt: z.date(),
  acceptedAt: z.date().nullable().optional(),
})

export type Invite =
  z.infer<typeof inviteEntitySchema>

export const createInviteSchema = z.object({
  organizationId: z.string(),

  name: z
      .string()
      .trim()
      .min(2)
      .max(120),

  email: z
      .string()
      .trim(),

  role: inviteRoleSchema,
  status: inviteStatusSchema,
})

export type CreateInviteInput =
z.infer<typeof createInviteSchema> 

export const acceptInviteSchema = z.object({
    token: z.string(),
    name: z.string().min(2),
    password: z.string().min(8),
    confirmPassword: z.string(),
  }).refine(
    (data) =>
      data.password ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem.",
    }
  )

export type AcceptInviteInput =
z.infer<typeof acceptInviteSchema>