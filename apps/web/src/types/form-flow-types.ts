export type FlowStep<TFormValues, TResponse = any> = {
  id: string

  form?: {
    trigger: () => Promise<boolean>
    getValues: () => TFormValues
  }

  onSubmit?: (
    values: TFormValues,
    context: FlowContext
  ) => Promise<TResponse>

  onSuccess?: (
    response: TResponse,
    context: FlowContext
  ) => void
}

export type FlowContext = {
  data: Record<string, any>
  set: (key: string, value: any) => void
  get: (key: string) => any
}