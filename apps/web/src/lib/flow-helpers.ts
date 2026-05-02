import { FlowContext } from "@/types/form-flow-types"

export function mergeContextStep<
  TContext,
  K extends keyof TContext
>(
  context: FlowContext<TContext>,
  key: K,
  value: Partial<TContext[K]>
) {
  const prev = context.get(key)

  const next = {
    ...(prev ?? {}),
    ...value
  } as TContext[K]

  context.set(key, next)
}