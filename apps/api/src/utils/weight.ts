export function fromMiligrams(value: number) {
  return value / 1000
}

export function toMiligrams(value: number) {
  return Math.round(value * 1000)
}