import { useCallback } from "react"
import { produce } from "immer"

export function useStepController<
  TContext,
  K extends keyof TContext
>(flow: any, key: K) {

  const data = flow.context.get(key) as TContext[K]

  const set = useCallback((value: TContext[K]) => {
    flow.context.set(key, value)
  }, [flow, key])

  const update = useCallback((partial: Partial<TContext[K]>) => {
    const current = flow.context.get(key) || {}

    flow.context.set(key, {
      ...current,
      ...partial
    })
  }, [flow, key])

  // 🔥 NOVO: update com draft (immer)
  const mutate = useCallback((fn: (draft: TContext[K]) => void) => {
    const current = flow.context.get(key) || {}

    const next = produce(current, fn)

    flow.context.set(key, next)
  }, [flow, key])

  return {
    data,
    set,
    update,
    mutate // 👈 estrela da casa
  }
}
