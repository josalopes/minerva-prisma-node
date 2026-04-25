export type FlowStep<
TFormValues,
TContext = Record<string, any>, 
TResponse = any
> = {
  id: string

  form?: {
    trigger: () => Promise<boolean>
    getValues: () => TFormValues
  }

  optional?: boolean
  label: string

  onSubmit?: (
    values: TFormValues,
    context: FlowContext<TContext>
  ) => Promise<TResponse>

  onSuccess?: (
    response: TResponse,
    context: FlowContext<TContext>
  ) => void
}

export type FlowContext<TContext = Record<string, any>> = {
  data: TContext

  set: <K extends keyof TContext>(
    key: K,
    value: TContext[K]
  ) => void

  get: <K extends keyof TContext>(
    key: K
  ) => TContext[K]
}
