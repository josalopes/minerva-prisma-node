"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useChangePassword }from "@/hooks/use-change-password"
import { toast } from "sonner"

export default function ChangePasswordPage() {
  const router = useRouter()

  const mutation = useChangePassword()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (
      newPassword !== confirmPassword
    ) {
      toast(
        "As senhas não coincidem"
      )
      return
    }

    try {
      await mutation.mutateAsync({
        currentPassword,
        newPassword
      })

      toast(
        "Senha alterada com sucesso"
      )

      router.push("/")
    } catch (err) {
      console.error(err)

      toast(
        "Erro ao alterar senha"
      )
    }
  }

  return (
    <div
      className="
        max-w-md
        mx-auto
        mt-10
      "
    >
      <h1
        className="
          text-2xl
          font-bold
          mb-6
        "
      >
        Alterar senha
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <input
          type="password"
          placeholder="Senha atual"

          value={currentPassword}

          onChange={(e) =>
            setCurrentPassword(
              e.target.value
            )
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          type="password"
          placeholder="Nova senha"

          value={newPassword}

          onChange={(e) =>
            setNewPassword(
              e.target.value
            )
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <input
          type="password"
          placeholder="Confirmar senha"

          value={confirmPassword}

          onChange={(e) =>
            setConfirmPassword(
              e.target.value
            )
          }

          className="
            w-full
            border
            rounded-lg
            px-3
            py-2
          "
        />

        <button
          type="submit"

          disabled={mutation.isPending}

          className="
            w-full
            bg-primary
            text-white
            rounded-lg
            py-2
          "
        >
          {mutation.isPending
            ? "Salvando..."
            : "Alterar senha"}
        </button>

      </form>
    </div>
  )
}