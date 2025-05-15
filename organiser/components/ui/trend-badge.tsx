import { Badge } from "@/components/ui/badge"
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react"

interface TrendBadgeProps {
    isUptrend: boolean
    value: string
}

export function TrendBadge({ isUptrend, value }: TrendBadgeProps) {
  return (
    <Badge variant={isUptrend ? "outline-green" : "outline-red"}>
      {isUptrend ? <IconTrendingUp /> : <IconTrendingDown />}
      {value}
    </Badge>
  )
}