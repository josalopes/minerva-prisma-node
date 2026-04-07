import { useEffect, useState } from "react"

export function useAutoSaveStatus(deps: any) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle")

  useEffect(() => {
    setStatus("saving")

    const t = setTimeout(() => {
      setStatus("saved")
    }, 500)

    return () => clearTimeout(t)
  }, [deps])

  return status
}