"use client"

import { ReactNode } from "react"
import { Control, FieldValues, Path } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Check } from "lucide-react"
import clsx from "clsx"
import { useFieldStatus } from "@/hooks/use-field-status"

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

export function FormFieldBase<T extends FieldValues>({
  control,
  name,
  label,
  className,
  children
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const status = useFieldStatus({
          value: field.value,
          error: fieldState.error
        })

        return (
          <FormItem className={clsx("space-y-2", className)}>
            {label && (
              <FormLabel className="flex items-center gap-2">
                {label}

                {status.isValid && (
                  <Check className="text-success w-4 h-4" />
                )}
              </FormLabel>
            )}

            <FormControl>
              {children({ field, fieldState, status })}
            </FormControl>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}