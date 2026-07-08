"use client"

import { UseFormReturn } from "react-hook-form"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

import {
  Shield,
  User,
  Receipt,
  ScanLine,
} from "lucide-react"

import { AppFormField } from "@/components/app-form-field"
import { InviteFormData } from "@saas/contracts/invite"

type Props = {
  form: UseFormReturn<InviteFormData>
}

export function InviteFields({
  form,
}: Props) {

  return (
    <div className="grid grid-cols-1 gap-4">

      {/* Nome */}
      <AppFormField
        control={form.control}
        name="name"
        label="Nome"
      >
        {(field) => (
          <Input
            {...field}
            placeholder="Nome do convidado..."
          />
        )}
      </AppFormField>

      {/* Email */}
      <AppFormField
        control={form.control}
        name="email"
        label="E-mail"
      >
        {(field) => (
          <Input
            {...field}
            type="email"
            placeholder="email@empresa.com"
          />
        )}
      </AppFormField>

      {/* Perfil */}
      <div className="space-y-2">

        <Label>
          Perfil
        </Label>

        <ToggleGroup
          type="single"
          value={form.watch("role")}
          onValueChange={(value) => {
            if (value) {
              form.setValue(
                "role",
                value as InviteFormData["role"]
              )
            }
          }}
          className="grid grid-cols-2 lg:grid-cols-4"
        >

          <ToggleGroupItem
            value="ADMIN"
            className="flex h-12 gap-2 border"
          >
            <Shield className="h-4 w-4" />
            Admin
          </ToggleGroupItem>

          <ToggleGroupItem
            value="MEMBER"
            className="flex h-12 gap-2 border"
          >
            <User className="h-4 w-4" />
            Membro
          </ToggleGroupItem>

          <ToggleGroupItem
            value="BILLING"
            className="flex h-12 gap-2 border"
          >
            <Receipt className="h-4 w-4" />
            Financeiro
          </ToggleGroupItem>

          <ToggleGroupItem
            value="CHECKIN"
            className="flex h-12 gap-2 border"
          >
            <ScanLine className="h-4 w-4" />
            Check-in
          </ToggleGroupItem>

        </ToggleGroup>

      </div>

    </div>
  )
}