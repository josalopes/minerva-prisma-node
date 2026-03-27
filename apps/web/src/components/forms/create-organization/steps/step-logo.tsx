"use client"

import { UseFormReturn } from "react-hook-form"
import { CreateOrganizationFormData } from "@/schemas/create-organization-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Step3Logo({
  form
}: {
  form: UseFormReturn<CreateOrganizationFormData>
}) {

  return (
    <div className="space-y-4">

      <Label>Logo da organização</Label>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) =>
          form.setValue("logo", e.target.files?.[0])
        }
      />

    </div>
  )
}