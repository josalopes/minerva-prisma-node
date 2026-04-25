import { CnpjData } from "@/types/cnpj"
import { useRef, useState } from "react"

type ApplyHandler = (data: CnpjData) => void

export function useCompanyPreview() {
  const [data, setData] = useState<CnpjData | null>(null)
  const [open, setOpen] = useState(false)
  const applyRef = useRef<ApplyHandler | null>(null)

  function show(company: CnpjData, onApply?: ApplyHandler) {
    setData(company)
    setOpen(true)
    applyRef.current = onApply || null
  }

  function apply() {
    if (data && applyRef.current) {
      applyRef.current(data)
    }
    setOpen(false)
  }

  function close() {
    setOpen(false)
  }

  function reset() {
    setOpen(false)
    setData(null)
    applyRef.current = null
  }

  return {
    data,
    open,
    show,
    apply,
    close,
    reset
  }
}
