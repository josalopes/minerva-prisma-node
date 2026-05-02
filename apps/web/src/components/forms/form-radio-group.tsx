"use client"

import { Control, FieldValues, Path } from "react-hook-form"
import { AppFormField } from "@/components/app-form-field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options,
  disabled
}: Props<T>) {
  return (
    <AppFormField control={control} name={name} label={label}>
      {(field) => (
        <RadioGroup
          value={field.value}
          disabled={disabled}
          onValueChange={field.onChange}
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
