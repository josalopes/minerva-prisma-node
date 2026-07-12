'use client'

import { ReactNode } from 'react'
import { Control, FieldValues, Path } from 'react-hook-form'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Check } from 'lucide-react'
import clsx from 'clsx'

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
  children,
}: Props<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const isSuccess = !fieldState.invalid && !!field.value

        return (
          <FormItem className={clsx('space-y-2', className)}>
            {label && (
              <FormLabel className="flex items-center gap-2">{label}</FormLabel>
            )}

            {/* INPUT + ACTION */}
            <div className="flex items-center gap-2">
              <FormControl className="flex-1">
                <div className="relative">
                  {children(field, fieldState)}

                  {/* ✔ CHECK INLINE */}
                  {isSuccess && (
                    <Check className="text-success absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                  )}
                </div>
              </FormControl>

              {action && <div>{action}</div>}
            </div>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}
