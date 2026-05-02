"use client"

import { ReactNode } from "react"
import { Control, FieldValues, Path } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Check } from "lucide-react"
import clsx from "clsx"
import { useFieldStatus } from "@/hooks/use-field-status"
import { FieldStatusIcon } from "@/lib/field-status-icon"

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  action?: ReactNode
  className?: string
  children: (field: any, fieldState: any) => ReactNode
}

export function AppFormField<T extends FieldValues>({
  control,
  name,
  label,
  action,
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
          error: fieldState.error,
        })

        const isSuccess =
          !fieldState.invalid &&
          !!field.value

        return (
          <FormItem className={clsx("space-y-2", className)}>
            {label && (
              <FormLabel className="flex items-center gap-2">
                {label}

                {/* <FieldStatusIcon
                  isValid={isSuccess}
                  hasError={status.hasError}
                  isLoading={status.isLoading}
                /> */}

                {/* ✔ SUCCESS ICON */}
                {/* {isSuccess && (
                  <Check className="text-success w-4 h-4" />
                )} */}
              </FormLabel>
            )}

            {/* INPUT + ACTION */}
            <div className="flex gap-2 items-center">
              <FormControl className="flex-1">
                <div className="relative">
                  {children(field, fieldState)}

                  {/* ✔ CHECK INLINE */}
                  {isSuccess && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 text-success w-4 h-4" />
                  )}
                </div>
              </FormControl>

              {action && (
                <div>
                  {action}
                </div>
              )}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}