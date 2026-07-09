'use client'

import { Control, FieldValues, Path } from 'react-hook-form'
import { AppFormField } from '@/components/app-form-field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Option {
  label: string
  value: string
}

interface Props<T extends FieldValues> {
  control: Control<T>
  name: Path<T>
  label?: string
  options: Option[]
  disabled?: boolean
  onSelectionChange?: (previous: string | undefined, current: string) => void
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled,
  onSelectionChange,
}: Props<T>) {
  return (
    <AppFormField control={control} name={name} label={label}>
      {(field) => (
        <RadioGroup
          value={field.value}
          disabled={disabled}
          onValueChange={(value) => {
            // avisa quem está usando o componente
            onSelectionChange?.(value, field.value)

            // depois atualiza o React Hook Form
            field.onChange(value)
          }}
          className="flex gap-4"
        >
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <Label htmlFor={opt.value}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </AppFormField>
  )
}
