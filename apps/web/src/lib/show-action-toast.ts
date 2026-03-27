import { toast } from "sonner"

export function handleServerActionResult(result: any) {

  if (!result.success) {

    if (result.message) {
      toast.error(result.message)
      return false
    }

    if (result.errors) {

      const errors = Object.values(result.errors)
        .flat()
        .filter(Boolean)

      if (errors.length) {
        toast.error(errors[0] as string)
      }

      return false
    }

    toast.error("Erro inesperado")
    return false
  }

  return true
}

// import { toast } from "sonner"

// export function handleServerActionResult(result: any) {

//   if (!result) {
//     toast.error("Resposta inválida da ação")
//     return false
//   }

//   if (result.success) {
//     return true
//   }

//   // erro com mensagem
//   if (result.message) {
//     toast.error(result.message)
//     return false
//   }

//   // erro de validação
//   if (result.errors) {

//     const errors = Object.values(result.errors)
//       .flat()
//       .filter(Boolean)

//     if (errors.length > 0) {
//       toast.error(errors[0] as string)
//       return false
//     }

//     // se não há erro real
//     return true
//   }

//   toast.error("Erro inesperado")
//   return false
// }

