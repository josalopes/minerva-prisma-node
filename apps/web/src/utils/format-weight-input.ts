export function formatWeightInput(value: string) {

  value = value.replace(/\D/g, "")

  if (!value) return ""

  value = (parseInt(value, 10) / 1000).toFixed(3)

  value = value.replace(".", ",")

  value = value.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  )

  return value
}