import { isValidCpfCnpj } from '@/utils/cpf-cnpj-utils'
import { z } from 'zod'

// ==============================
// 🔤 STRING OBRIGATÓRIA
// ==============================
export const requiredString = (label: string) =>
  z
    .string()
    // .optional()
    .transform((val) => val ?? '')
    .refine((val) => val.trim().length > 0, {
      message: `${label} é obrigatório`,
    })

// ==============================
// 🔤 STRING OPCIONAL (com trim)
// ==============================
export const optionalString = () =>
  z
    .string()
    .optional()
    .transform((val) => val?.trim() || undefined)

// ==============================
// 🔢 ENUM OBRIGATÓRIO (com mensagem)
// ==============================
export const requiredEnum = <T extends [string, ...string[]]>(
  values: T,
  message: string,
) =>
  z
    .enum(values)
    .optional()
    .refine((val) => val !== undefined, {
      message,
    })

// ==============================
// 📧 EMAIL
// ==============================
export const email = (label = 'E-mail') =>
  z.string().min(1, `${label} é obrigatório`)

// ==============================
// 🌐 DOMÍNIO
// ==============================
export const domain = () => optionalString()

// export const domain = () =>
//   requiredString("Domínio").refine(
//     (val) => /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(val),
//     {
//       message: "Domínio inválido"
//     }
//   )

// ==============================
// 🆔 CPF/CNPJ (básico)
// ==============================
export const cpfCnpj = () =>
  z
    .string()
    .min(1, 'Dodumento é obrigatório')
    .refine(
      (val) => {
        const clean = val.replace(/\D/g, '')

        // if (clean.length < 11) return true

        // if (clean.length === 11) return isValidCPF(clean)
        // if (clean.length === 14) return isValidCNPJ(clean)

        return isValidCpfCnpj(clean)
        // return digits.length === 11 || digits.length === 14
      },
      {
        message: 'CPF/CNPJ inválido',
      },
    )

// ==============================
// 📮 CEP
// ==============================
export const cep = () =>
  requiredString('CEP').refine((val) => val.replace(/\D/g, '').length === 8, {
    message: 'CEP inválido',
  })

// ==============================
// 📞 TELEFONE
// ==============================
export const phone = () =>
  requiredString('Telefone').refine(
    (val) => val.replace(/\D/g, '').length >= 10,
    {
      message: 'Telefone inválido',
    },
  )

// ==============================
// 🔢 NÚMERO (string ou number)
// ==============================
export const requiredNumber = (label: string) =>
  z.coerce.number().refine((val) => val !== undefined && !isNaN(val), {
    message: `${label} é obrigatório`,
  })

// ==============================
// 🔘 BOOLEAN OPCIONAL
// ==============================
export const optionalBoolean = () => z.boolean().optional()

// ==============================
// 🔘 BOOLEAN REQUERIDO
// ==============================
export const requiredBoolean = () => z.boolean()
