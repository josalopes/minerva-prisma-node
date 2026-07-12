/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { Control, FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { FormFieldBase } from '@/components/form-field-base'
import { Input } from '@/components/ui/input'
import { Loader2, Check, X } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import clsx from 'clsx'
import { useFieldStatus } from '@/hooks/use-field-status'

interface Props<T extends FieldValues> {
  control: Control<T>
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  className?: string
  placeholder?: string

  action?: React.ReactNode
  transform?: (value: string) => string
  onBlurAsync?: (value: string) => void

  asyncError?: string | null
  isLoading?: boolean

  asyncField?: {
    error: string | null
    isLoading: boolean
    onChangeAsyncClear: (value: string) => void
    onBlurAsync: (value: string) => void
  }
}

export function FormInputWithAction<T extends FieldValues>({
  control,
  form,
  name,
  label,
  className,
  placeholder,
  action,
  transform,
  asyncField,
}: Props<T>) {
  return (
    <FormFieldBase
      control={control}
      name={name}
      label={label}
      className={className}
    >
      {({ field, fieldState }) => {
        const asyncError = asyncField?.error
        const isLoading = asyncField?.isLoading
        const onBlurAsync = asyncField?.onBlurAsync
        const onChangeAsyncClear = asyncField?.onChangeAsyncClear

        const finalStatus = useFieldStatus({
          value: field.value,
          error: fieldState.error,
          isLoading,
          isDirty: fieldState.isDirty,
        })

        const hasSyncError = !!fieldState.error
        const hasAsyncError = !!asyncError && !hasSyncError

        const showAsyncError =
          asyncError && !hasSyncError && !finalStatus.isValid

        return (
          <div className="flex gap-2">
            {/* INPUT + ICON */}
            <div className="relative flex-1">
              <Input
                {...field}
                placeholder={placeholder}
                onChange={(e) => {
                  let value = e.target.value
                  if (transform) value = transform(value)

                  field.onChange(value)

                  // onChangeAsyncClear?.(value)
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
                  'pr-10',
                  finalStatus.hasError && 'field-error',
                  finalStatus.isValid &&
                    'border-success focus-visible:ring-success',
                )}
              />

              {/* ICON */}
              <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
                {/* LOADING */}
                {finalStatus.isLoading && (
                  <Loader2 className="text-muted-foreground h-4 w-4 animate-spin" />
                )}

                {/* ERROR */}
                {!isLoading && (hasSyncError || showAsyncError) && (
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="pointer-events-auto">
                        <X className="animate-fade-in h-4 w-4 text-red-500" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {fieldState.error?.message || asyncError}
                    </TooltipContent>
                  </Tooltip>
                )}

                {/* SUCCESS */}
                {!hasSyncError && !hasAsyncError && field.value && (
                  <Check className="text-success animate-fade-in h-4 w-4" />
                )}
              </div>
            </div>

            {/* ACTION BUTTON */}
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )
      }}
    </FormFieldBase>
  )
}
