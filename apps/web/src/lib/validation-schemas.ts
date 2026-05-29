import z from "zod";

export const resetPasswordFormSchema = z.object({
    currentPassword: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    newPassword: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string(),
})
.refine(
    (data) =>
      data.newPassword ===
      data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "As senhas não coincidem",
    }
  )

export type ResetPasswordType = z.infer<typeof resetPasswordFormSchema>

