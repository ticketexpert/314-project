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

export const description = "An interactive area chart showing ticket sales over time"

interface Event {
  eventId: number;
  title: string;
  category: string;
  tags: string[];
  image: string;
  description: string;
  fromDateTime: string;
  toDateTime: string;
  region: string;
  venue: string;
  pricing: Array<{
    type: string;
    price: number;
    numTicketsAvailable: number;
  }>;
  refundPolicy: string;
  organiser: string;
  eventOrgId: number;
  orgDescription: string;
  orgContact: string;
  orgFollow: string[];
  eventShareLinks: string[];
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  ticketId: string;
  eventId: number;
  ticketType: string;
  createdAt: string;
}

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [chartData, setChartData] = React.useState<Array<{ date: string; sales: number }>>([])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both events and tickets data
        const [eventsResponse, ticketsResponse] = await Promise.all([
          fetch('https://api.ticketexpert.me/api/events'),
          fetch('https://api.ticketexpert.me/api/tickets')
        ]);
        
        const eventsData: Event[] = await eventsResponse.json();
        const ticketsData: Ticket[] = await ticketsResponse.json();

        // Create a map of event prices by type
        const eventPrices = new Map<number, Map<string, number>>();
        eventsData.forEach(event => {
          const priceMap = new Map<string, number>();
          event.pricing.forEach(price => {
            priceMap.set(price.type, price.price);
          });
          eventPrices.set(event.eventId, priceMap);
        });

        // Process tickets data to create daily sales data
        const salesByDate = ticketsData.reduce((acc, ticket) => {
          const date = new Date(ticket.createdAt).toISOString().split('T')[0];
          const price = eventPrices.get(ticket.eventId)?.get(ticket.ticketType) || 0;

          if (!acc[date]) {
            acc[date] = 0;
          }
          acc[date] += price;
          return acc;
        }, {} as Record<string, number>);

        // Convert to array format for the chart
        const processedData = Object.entries(salesByDate)
          .map(([date, sales]) => ({
            date,
            sales: Math.round(sales)
          }))
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setChartData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = React.useMemo(() => {
    const now = new Date();
    const startDate = new Date(now);
    
    // Set the start date based on the selected time range
    switch (timeRange) {
      case "7d":
        startDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 90);
    }

    // Filter data points that fall within the selected time range
    return chartData.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= now;
    });
  }, [chartData, timeRange]);

  const chartConfig = {
    visitors: {
      label: "Sales",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle className="text-[#034AA6]">Ticket Sales</CardTitle>
        <CardDescription className="text-muted-foreground">
          <span className="hidden @[540px]/card:block">
            Total sales for the selected period
          </span>
          <span className="@[540px]/card:hidden">Selected period</span>
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
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
                    });
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
  );
}