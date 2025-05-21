"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", sales: 222 },
  { date: "2024-04-02", sales: 97 },
  { date: "2024-04-03", sales: 167 },
  { date: "2024-04-04", sales: 242 },
  { date: "2024-04-05", sales: 373 },
  { date: "2024-04-06", sales: 301 },
  { date: "2024-04-07", sales: 245 },
  { date: "2024-04-08", sales: 409 },
  { date: "2024-04-09", sales: 59 },
  { date: "2024-04-10", sales: 261 },
  { date: "2024-04-11", sales: 327 },
  { date: "2024-04-12", sales: 292 },
  { date: "2024-04-13", sales: 342 },
  { date: "2024-04-14", sales: 137 },
  { date: "2024-04-15", sales: 120 },
  { date: "2024-04-16", sales: 138 },
  { date: "2024-04-17", sales: 446 },
  { date: "2024-04-18", sales: 364 },
  { date: "2024-04-19", sales: 243 },
  { date: "2024-04-20", sales: 89 },
  { date: "2024-04-21", sales: 137 },
  { date: "2024-04-22", sales: 224 },
  { date: "2024-04-23", sales: 138 },
  { date: "2024-04-24", sales: 387 },
  { date: "2024-04-25", sales: 215 },
  { date: "2024-04-26", sales: 75 },
  { date: "2024-04-27", sales: 383 },
  { date: "2024-04-28", sales: 122 },
  { date: "2024-04-29", sales: 315 },
  { date: "2024-04-30", sales: 454 },
  { date: "2024-05-01", sales: 165 },
  { date: "2024-05-02", sales: 293 },
  { date: "2024-05-03", sales: 247 },
  { date: "2024-05-04", sales: 385 },
  { date: "2024-05-05", sales: 481 },
  { date: "2024-05-06", sales: 498 },
  { date: "2024-05-07", sales: 388 },
  { date: "2024-05-08", sales: 149 },
  { date: "2024-05-09", sales: 227 },
  { date: "2024-05-10", sales: 293 },
  { date: "2024-05-11", sales: 335 },
  { date: "2024-05-12", sales: 197 },
  { date: "2024-05-13", sales: 197 },
  { date: "2024-05-14", sales: 448 },
  { date: "2024-05-15", sales: 473 },
  { date: "2024-05-16", sales: 338 },
  { date: "2024-05-17", sales: 499 },
  { date: "2024-05-18", sales: 315 },
  { date: "2024-05-19", sales: 235 },
  { date: "2024-05-20", sales: 177 },
  { date: "2024-05-21", sales: 82 },
  { date: "2024-05-22", sales: 81 },
  { date: "2024-05-23", sales: 252 },
  { date: "2024-05-24", sales: 294 },
  { date: "2024-05-25", sales: 201 },
  { date: "2024-05-26", sales: 213 },
  { date: "2024-05-27", sales: 420 },
  { date: "2024-05-28", sales: 233 },
  { date: "2024-05-29", sales: 78 },
  { date: "2024-05-30", sales: 340 },
  { date: "2024-05-31", sales: 178 },
  { date: "2024-06-01", sales: 178 },
  { date: "2024-06-02", sales: 470 },
  { date: "2024-06-03", sales: 103 },
  { date: "2024-06-04", sales: 439 },
  { date: "2024-06-05", sales: 88 },
  { date: "2024-06-06", sales: 294 },
  { date: "2024-06-07", sales: 323 },
  { date: "2024-06-08", sales: 385 },
  { date: "2024-06-09", sales: 438 },
  { date: "2024-06-10", sales: 155 },
  { date: "2024-06-11", sales: 92 },
  { date: "2024-06-12", sales: 492 },
  { date: "2024-06-13", sales: 81 },
  { date: "2024-06-14", sales: 426 },
  { date: "2024-06-15", sales: 307 },
  { date: "2024-06-16", sales: 371 },
  { date: "2024-06-17", sales: 475 },
  { date: "2024-06-18", sales: 107 },
  { date: "2024-06-19", sales: 341 },
  { date: "2024-06-20", sales: 408 },
  { date: "2024-06-21", sales: 169 },
  { date: "2024-06-22", sales: 317 },
  { date: "2024-06-23", sales: 480 },
  { date: "2024-06-24", sales: 132 },
  { date: "2024-06-25", sales: 141 },
  { date: "2024-06-26", sales: 434 },
  { date: "2024-06-27", sales: 448 },
  { date: "2024-06-28", sales: 149 },
  { date: "2024-06-29", sales: 103 },
  { date: "2024-06-30", sales: 446 },
]

const chartConfig = {
  visitors: {
    label: "Sales",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-[#034AA6]">Total Sales</CardTitle>
        <CardDescription className="text-muted-foreground">
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d" className="data-[state=on]:bg-[#034AA6] data-[state=on]:text-white">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="data-[state=on]:bg-[#034AA6] data-[state=on]:text-white">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="data-[state=on]:bg-[#034AA6] data-[state=on]:text-white">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg hover:bg-[#034AA6] hover:text-white">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg hover:bg-[#034AA6] hover:text-white">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg hover:bg-[#034AA6] hover:text-white">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#034AA6" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#4D79C9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="sales"
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--primary)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}