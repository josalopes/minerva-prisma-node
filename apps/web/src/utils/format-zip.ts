export function formatZipCode(value: string) {
  const numbers = value.replace(/\D/g, '').slice(0, 8)

  if (numbers.length <= 5) return numbers
  return `${numbers.slice(0, 5)}-${numbers.slice(5)}`
}