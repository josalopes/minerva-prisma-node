'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'

import { inviteFormSchema, InviteFormData } from '@saas/contracts/invite'

import { InviteFields } from './invite-fields'
import { useCreateInvite } from '@/hooks/use-create-invite'

type Props = {
  organizationId: string
  onSuccess?(): void
}

const emptyValues: InviteFormData = {
  name: '',
  email: '',
  role: 'MEMBER',
}

export function InviteForm({ organizationId, onSuccess }: Props) {
  const createMutation = useCreateInvite()

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),

    defaultValues: emptyValues,
  })

  async function submit(values: InviteFormData) {
    try {
      const result = await createMutation.mutateAsync({
        organizationId,

        ...values,
      })

      if (!result?.success) {
        toast.error(result?.message ?? 'Erro ao enviar convite.')

        return
      }

      toast.success('Convite enviado com sucesso.')

      form.reset(emptyValues)

      onSuccess?.()
    } catch {
      toast.error('Erro inesperado.')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="space-y-6">
        <InviteFields form={form} />

        <div className="flex justify-end">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Enviando...' : 'Enviar convite'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
