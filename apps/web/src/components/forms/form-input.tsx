"use client"

import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Loader2, Check, X } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"
import clsx from "clsx"
import { FormFieldBase } from "@/components/form-field-base"
import { useFieldStatus } from "@/hooks/use-field-status"

interface Props<T extends FieldValues> {
  control: Control<T>
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  placeholder?: string
  asyncError?: string | null
  transform?: (value: string) => string

  asyncField?: {
    error: string | null
    isLoading: boolean
    onChangeAsyncClear: (value: string) => void
    onBlurAsync: (value: string) => void
  }
}

export function FormInput<T extends FieldValues>({
  control,
  form,
  name,
  label,
  placeholder,
  asyncError,
  asyncField,
  transform
}: Props<T>) {
  return (
    <FormFieldBase control={control} name={name} label={label}>
      {({ field, fieldState, status }) => {
        const asyncError = asyncField?.error
        const isLoading = asyncField?.isLoading
        const onBlurAsync = asyncField?.onBlurAsync
        const onChangeAsyncClear = asyncField?.onChangeAsyncClear

        const finalStatus = useFieldStatus({
          value: field.value,
          error: fieldState.error,
          isLoading,
          isDirty: fieldState.isDirty
        })

        const hasSyncError = !!fieldState.error
        const hasAsyncError = !!asyncError && !hasSyncError

        const showAsyncError =
          asyncError &&
          !hasSyncError &&
          !finalStatus.isValid

        return (
          <div className="relative">

            <Input
              {...field}
              placeholder={placeholder}
              onChange={(e) => {
                let value = e.target.value
                if (transform) value = transform(value)

                field.onChange(value)
                onChangeAsyncClear?.(value)

                if (!fieldState.error) {
                  onChangeAsyncClear?.(value)
                }

                if (fieldState.error) {
                  form.trigger(name)
                }
              }}
              onBlur={(e) => {
                field.onBlur()
                  onBlurAsync?.(e.target.value)
              }}
              className={clsx(
                "pr-10",
                finalStatus.hasError && "field-error",
                finalStatus.isValid && "border-success focus-visible:ring-success"
              )}
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              {finalStatus.isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground absolute" />
              )}

              {!isLoading && (hasSyncError || showAsyncError) && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="pointer-events-auto">
                      <X className="w-4 h-4 text-red-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {fieldState.error?.message || asyncError}
                  </TooltipContent>
                </Tooltip>
              )}

              {!hasSyncError && !hasAsyncError && field.value && (
                <Check className="w-4 h-4 text-success" />
              )}
            </div>
          </div>
        )
      }}
    </FormFieldBase>
  )
}
