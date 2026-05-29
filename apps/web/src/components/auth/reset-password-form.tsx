'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

import { useChangePassword }from "@/hooks/use-change-password"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { PasswordInput } from '@/components/ui/password-input'

import { resetPasswordFormSchema } from '@/lib/validation-schemas'
import { ApiError } from '@/lib/api-error'
import { deleteToken } from './action'

const formSchema = resetPasswordFormSchema

export default function ResetPasswordPreview() {
  const router = useRouter()
  const mutation = useChangePassword()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {    
    try {
      await mutation.mutateAsync({
        currentPassword:
          values.currentPassword,

        newPassword:
          values.newPassword,
      })
      toast.success(
        'Senha alterada com sucesso. Efetue novo login.',
      )
      deleteToken()
      router.push("/auth/sign-in")

    } catch (error) {
       if (error instanceof ApiError) {
        toast.error(
          `${error.message}`
        )

        return
      }
      toast.error(
        "Erro inesperado"
      )
    }
  }

  return (
    <div className="flex min-h-[50vh] h-full w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Trocar senha</CardTitle>
          <CardDescription>
            Entre com uma nova senha e faça sua confirmação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                {/* Current Password Field */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="currentPassword">Senha atual</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="currentPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="newPassword">Nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="newPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword">
                        Confirmar senha
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Alterar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
