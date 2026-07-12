/* eslint-disable react-hooks/rules-of-hooks */

'use client'

import { Control, FieldValues, Path } from 'react-hook-form'
import { AppFormField } from '@/components/app-form-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { FieldStatusIcon } from '@/lib/field-status-icon'
import { useFieldStatus } from '@/hooks/use-field-status'

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label: string
  description?: string
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  description,
}: Props<T>) {
  return (
    <AppFormField control={control} name={name}>
      {(field, fieldState) => {
        const status = useFieldStatus({
          value: field.value,
          error: fieldState.error,
        })

        return (
          <div className="flex items-start gap-3 leading-none">
            <Checkbox
              id={name}
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            <div className="space-y-1">
              <Label
                htmlFor={name}
                className="flex cursor-pointer items-center gap-2"
              >
                {label}

                <FieldStatusIcon
                  isValid={status.isValid}
                  hasError={status.hasError}
                  isLoading={status.isLoading}
                />
              </Label>

              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </div>
        )
      }}
    </AppFormField>
  )
}
