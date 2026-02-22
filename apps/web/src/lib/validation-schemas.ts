import z from "zod";

export const resetPasswordFormSchema = z.object({
    password: z.string(),
    confirmPassword: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
})

export type ResetPasswordType = z.infer<typeof resetPasswordFormSchema>

