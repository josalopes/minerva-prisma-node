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
}

export function FormRadioGroup<T extends FieldValues>({
  control,
  name,
  label,
  options
}: Props<T>) {
  return (
    <AppFormField control={control} name={name} label={label}>
      {(field) => (
        <RadioGroup
          value={field.value}
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

// "use client"

// import { Control } from "react-hook-form"
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage
// } from "@/components/ui/form"

// import {
//   RadioGroup,
//   RadioGroupItem
// } from "@/components/ui/radio-group"

// import { Label } from "@/components/ui/label"

// interface Option {
//   label: string
//   value: string
// }

// interface FormRadioGroupProps {
//   control: Control<any>
//   name: string
//   label: string
//   options: Option[]
// }

// export function FormRadioGroup({
//   control,
//   name,
//   label,
//   options
// }: FormRadioGroupProps) {

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (

//         <FormItem className="space-y-3">

//           <FormLabel>
//             {label}
//           </FormLabel>

//           <FormControl>

//             <RadioGroup
//               value={field.value}
//               onValueChange={field.onChange}
//               className="flex gap-4"
//             >

//               {options.map(option => (

//                 <div
//                   key={option.value}
//                   className="flex items-center space-x-2"
//                 >

//                   <RadioGroupItem
//                     value={option.value}
//                     id={option.value}
//                   />

//                   <Label htmlFor={option.value}>
//                     {option.label}
//                   </Label>

//                 </div>

//               ))}

//             </RadioGroup>

//           </FormControl>

//           <FormMessage />

//         </FormItem>
//       )}
//     />
//   )
// }