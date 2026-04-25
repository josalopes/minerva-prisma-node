export function formatCpfCnpj(value: string, maxDigits = 14): string {
  let digits = value.replace(/\D/g, "").slice(0, maxDigits)

  if (maxDigits === 11) {
    digits = digits.replace(/^(\d{3})(\d)/, "$1.$2")
    digits = digits.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    digits = digits.replace(/\.(\d{3})(\d)/, ".$1-$2")
    return digits
  }

  digits = digits.replace(/^(\d{2})(\d)/, "$1.$2")
  digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
  digits = digits.replace(/\.(\d{3})(\d)/, ".$1/$2")
  digits = digits.replace(/(\d{4})(\d)/, "$1-$2")

  return digits
}
