"use client"

import { UseFormReturn } from "react-hook-form"
import { CreateOrganizationFormData } from "@/schemas/create-organization-form"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Step4Avatar({
  form
}: {
  form: UseFormReturn<CreateOrganizationFormData>
}) {
  return (
    <div className="space-y-4">
      <Label>Avatar da organização</Label>

      <Input
        type="file"
        accept="image/*"
        onChange={(e) =>
          form.setValue("avatar", e.target.files?.[0])
        }
      />
    </div>
  )
}