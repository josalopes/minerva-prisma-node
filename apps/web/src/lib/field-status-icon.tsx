import { Loader2, Check, X } from "lucide-react"

type Props = {
  isLoading?: boolean
  hasError?: boolean
  isValid?: boolean
}

export function FieldStatusIcon({
  isLoading,
  hasError,
  isValid
}: Props) {
  return (
    <div className="relative w-4 h-4">

      {isValid && (
        <Check className="w-4 h-4 text-success" />
      )}

      {hasError && (
        <X className="w-4 h-4 text-red-500 absolute top-0 left-0" />
      )}

      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground absolute top-0 left-0" />
      )}

    </div>
  )
}