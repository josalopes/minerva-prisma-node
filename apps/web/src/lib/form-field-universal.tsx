"use client"

import { Control, FieldValues, Path, UseFormReturn } from "react-hook-form"
import { ReactNode } from "react"
import clsx from "clsx"

import { Input } from "@/components/ui/input"
import { FormFieldBase } from "@/components/form-field-base"
import { useFieldStatus } from "@/hooks/use-field-status"
import { FieldStatusIcon } from "./field-status-icon"

type AsyncField = {
  error: string | null
  isLoading: boolean
  onChangeAsyncClear: (value: string) => void
  onBlurAsync: (value: string) => void
}

interface Props<T extends FieldValues> {
  control: Control<T>
  form: UseFormReturn<T>
  name: Path<T>

  label?: string
  placeholder?: string
  className?: string
  maxLength?: number

  transform?: (value: string) => string

  asyncField?: AsyncField
  action?: ReactNode

  render?: (params: {
    field: any
    fieldState: any
    status: ReturnType<typeof useFieldStatus>
  }) => ReactNode
}

export function FormFieldUniversal<T extends FieldValues>({
  control,
  form,
  name,
  label,
  placeholder,
  className,
  maxLength,
  transform,
  asyncField,
  action,
  render
}: Props<T>) {
  return (
    <FormFieldBase control={control} name={name} label={label} className={className}>
      {({ field, fieldState }) => {
        const asyncError = asyncField?.error
        const isLoading = asyncField?.isLoading

        const status = useFieldStatus({
          value: field.value,
          error: fieldState.error,
          isLoading
        })

        const hasSyncError = !!fieldState.error

        const hasAsyncError =
            typeof asyncError === "string" &&
            asyncError.length > 0 &&
            !hasSyncError &&
            !status.isValid

        const showAsyncError =
            asyncError &&
            !hasSyncError &&
            !status.isValid

        const isValid =
            !hasSyncError &&
            !hasAsyncError &&
            !!field.value

        // 🔥 custom render (select, radio, etc)
        if (render) {
          return render({ field, fieldState, status })
        }

        return (
          <div className="flex gap-2 items-center">

            <div className="relative flex-1">

              <Input
                {...field}
                placeholder={placeholder}
                maxLength={maxLength}
                onChange={(e) => {
                  let value = e.target.value
                  if (transform) value = transform(value)

                  field.onChange(value)

                  asyncField?.onChangeAsyncClear?.(value)

                  if (fieldState.error) {
                    form.trigger(name)
                  }
                }}
                onBlur={(e) => {
                  field.onBlur()
                  asyncField?.onBlurAsync?.(e.target.value)
                }}
                className={clsx(
                  "pr-10",
                  status.hasError && "field-error",
                  isValid && "border-success focus-visible:ring-success"
                )}
              />

              {/* STATUS ICON */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <FieldStatusIcon
                  isLoading={isLoading}
                  hasError={hasSyncError || hasAsyncError}
                  isValid={isValid}
                />
              </div>

            </div>

            {/* ACTION */}
            {action && (
              <div>
                {action}
              </div>
            )}

          </div>
        )
      }}
    </FormFieldBase>
  )
}