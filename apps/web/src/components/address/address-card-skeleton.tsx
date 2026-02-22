import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function AddressCardSkeleton() {
  return (
    <Card className="p-4 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </Card>
  )
}