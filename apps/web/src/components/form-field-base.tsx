'use client'
import { ReactNode } from 'react'
import {
  Control,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  Path,
} from 'react-hook-form'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Check } from 'lucide-react'
import clsx from 'clsx'

import { useFieldStatus } from '@/hooks/use-field-status'

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  className?: string
  children: (params: {
    field: any
    fieldState: any
    status: ReturnType<typeof useFieldStatus>
  }) => ReactNode
}

type RendererProps<T extends FieldValues> = {
  field: ControllerRenderProps<T>
  fieldState: ControllerFieldState
  label?: string
  className?: string
  children: Props<T>['children']
}

function FieldRenderer<T extends FieldValues>({
  field,
  fieldState,
  label,
  className,
  children,
}: RendererProps<T>) {
  const status = useFieldStatus({
    value: field.value,
    error: fieldState.error,
  })

  return (
    <FormItem className={clsx('space-y-2', className)}>
      {label && (
        <FormLabel className="flex items-center gap-2">
          {label}

          {status.isValid && <Check className="text-success h-4 w-4" />}
        </FormLabel>
      )}

      <FormControl>{children({ field, fieldState, status })}</FormControl>

      <FormMessage />
    </FormItem>
  )
}

export function FormFieldBase<T extends FieldValues>({
  control,
  name,
  label,
  className,
  children,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FieldRenderer<T>
          field={field}
          fieldState={fieldState}
          label={label}
          className={className}
        >
          {children}
        </FieldRenderer>
      )}
    />
  )
}
