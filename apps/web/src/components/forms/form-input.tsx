"use client"

import { Control } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

interface FormInputProps {
  control: Control<any>
  name: string
  label: string
  placeholder?: string
  type?: string
}

export function FormInput({
  control,
  name,
  label,
  placeholder,
  type = "text"
}: FormInputProps) {

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-semibold">
            {label}
          </FormLabel>

          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}