import { UseFormReturn } from "react-hook-form"

export function autoFill(
  form: UseFormReturn<any>,
  values: Record<string, any>
) {
  Object.entries(values).forEach(([key, value]) => {
    form.setValue(key, value, {
      shouldValidate: true,
      shouldTouch: true,
      shouldDirty: true
    })
  })
}