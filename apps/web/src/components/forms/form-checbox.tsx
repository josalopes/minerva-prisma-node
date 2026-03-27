"use client"

import { Control } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"

interface FormCheckboxProps {
  control: Control<any>
  name: string
  label: string
  description?: string
}

export function FormCheckbox({
  control,
  name,
  label,
  description
}: FormCheckboxProps) {

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (

        <FormItem className="space-y-3">

          <FormControl>
            <div className="flex items-start space-x-3">

              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />

              <div className="space-y-1 leading-none">

                <FormLabel>
                  {label}
                </FormLabel>

                {description && (
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                )}

              </div>

            </div>
          </FormControl>

          <FormMessage />

        </FormItem>
      )}
    />
  )
}