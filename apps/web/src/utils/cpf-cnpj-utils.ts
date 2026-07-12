export function isValidCpfCnpj(value: string): boolean {
  const clean = value.replace(/\D/g, '')

  if (clean.length === 11) return isValidCPF(clean)
  if (clean.length === 14) return isValidCNPJ(clean)

  return false
}

export function isValidCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, '')

  if (clean.length !== 11) return false
  if (/^(\d)\1+$/.test(clean)) return false // iguais

  let sum = 0

  for (let i = 0; i < 9; i++) {
    sum += Number(clean[i]) * (10 - i)
  }

  let firstDigit = (sum * 10) % 11
  if (firstDigit === 10) firstDigit = 0

  if (firstDigit !== Number(clean[9])) return false

  sum = 0

  for (let i = 0; i < 10; i++) {
    sum += Number(clean[i]) * (11 - i)
  }

  let secondDigit = (sum * 10) % 11
  if (secondDigit === 10) secondDigit = 0

  return secondDigit === Number(clean[10])
}

export function isValidCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, '')

  if (clean.length !== 14) return false
  if (/^(\d)\1+$/.test(clean)) return false

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
  const weights2 = [6, ...weights1]

  let sum = 0

  for (let i = 0; i < 12; i++) {
    sum += Number(clean[i]) * weights1[i]
  }

  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  if (firstDigit !== Number(clean[12])) return false

  sum = 0

  for (let i = 0; i < 13; i++) {
    sum += Number(clean[i]) * weights2[i]
  }

  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11)

  return secondDigit === Number(clean[13])
}
