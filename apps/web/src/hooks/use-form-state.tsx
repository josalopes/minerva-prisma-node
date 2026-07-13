import { useTransition, useState } from 'react'
import { requestFormReset } from 'react-dom'

import type { ActionResult } from '@/types/action-result'

export function useFormState<T>(
  action: (data: FormData) => Promise<ActionResult<T>>,
  onSuccess?: () => void | void,
  initialState?: ActionResult<T>,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormSate] = useState<ActionResult<T>>(
    initialState ?? {
      success: false,
    },
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const state = await action(data)

      if (state.success && onSuccess) {
        onSuccess()
      }

      setFormSate(state)
    })

    requestFormReset(form)
  }

  return [formState, handleSubmit, isPending] as const
}
