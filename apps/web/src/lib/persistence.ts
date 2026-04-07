export function loadPersistence(key: string) {
  if (typeof window === "undefined") return null

  const saved = localStorage.getItem(key)
  if (!saved) return null

  try {
    return JSON.parse(saved)
  } catch {
    return null
  }
}

export function savePersistence(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data))
}