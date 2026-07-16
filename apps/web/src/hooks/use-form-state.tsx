import { useTransition, useState } from 'react'
import { requestFormReset } from 'react-dom'

import type { ActionResult } from '@/types/action-result'

interface UseFormStateOptions<T> {
  onSuccess?: () => void
  beforeSubmit?: (data: FormData) => Promise<boolean | void>
  initialState?: ActionResult<T>
}

export function useFormState<T>(
  action: (data: FormData) => Promise<ActionResult<T>>,
  options?: UseFormStateOptions<T>,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormSate] = useState<ActionResult<T>>(
    options?.initialState ?? {
      success: false,
    },
  )

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = event.currentTarget
    const data = new FormData(form)

    if (options?.beforeSubmit) {
      const result = await options.beforeSubmit(data)

      if (result === false) {
        return
      }
    }

    startTransition(async () => {
      const state = await action(data)

      if (state.success && options?.onSuccess) {
        options.onSuccess()
      }

      setFormSate(state)
    })

    requestFormReset(form)
  }

  return [formState, handleSubmit, isPending] as const
}
