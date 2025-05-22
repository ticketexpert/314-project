import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { TrendBadge } from "@/components/ui/trend-badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

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

export function SectionCards() {
  const { organizationId } = useAuth()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalEvents: 0,
    totalTickets: 0,
    avgTicketPrice: 0,
    revenueTrend: 0,
    eventsTrend: 0,
    ticketsTrend: 0,
    priceTrend: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!organizationId) {
          throw new Error("Organization ID not found");
        }

        // Fetch events and tickets data
        const [eventsResponse, ticketsResponse] = await Promise.all([
          fetch('https://api.ticketexpert.me/api/events'),
          fetch('https://api.ticketexpert.me/api/tickets')
        ]);
        
        const eventsData: Event[] = await eventsResponse.json();
        const ticketsData: Ticket[] = await ticketsResponse.json();

        // Filter events for this organization
        const orgEvents = eventsData.filter(event => event.eventOrgId === Number(organizationId));
        
        // Create a map of event prices by type
        const eventPrices = new Map<number, Map<string, number>>();
        orgEvents.forEach(event => {
          const priceMap = new Map<string, number>();
          event.pricing.forEach(price => {
            priceMap.set(price.type, price.price);
          });
          eventPrices.set(event.eventId, priceMap);
        });

        // Filter tickets for events belonging to this organization
        const orgTickets = ticketsData.filter(ticket => 
          orgEvents.some(event => event.eventId === ticket.eventId)
        );

        // Get current date and dates for comparison
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        const sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(now.getDate() - 60);

        // Calculate revenue for both periods
        const calculatePeriodRevenue = (tickets: Ticket[], startDate: Date, endDate: Date) => {
          return tickets.reduce((sum, ticket) => {
            const ticketDate = new Date(ticket.createdAt);
            if (ticketDate >= startDate && ticketDate <= endDate) {
              const eventPrice = eventPrices.get(ticket.eventId)?.get(ticket.ticketType) || 0;
              return sum + eventPrice;
            }
            return sum;
          }, 0);
        };

        const currentRevenue = calculatePeriodRevenue(orgTickets, thirtyDaysAgo, now);
        const previousRevenue = calculatePeriodRevenue(orgTickets, sixtyDaysAgo, thirtyDaysAgo);

        // Calculate tickets for both periods
        const calculatePeriodTickets = (tickets: Ticket[], startDate: Date, endDate: Date) => {
          return tickets.filter(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            return ticketDate >= startDate && ticketDate <= endDate;
          }).length;
        };

        const currentTickets = calculatePeriodTickets(orgTickets, thirtyDaysAgo, now);
        const previousTickets = calculatePeriodTickets(orgTickets, sixtyDaysAgo, thirtyDaysAgo);

        // Calculate events for both periods
        const calculatePeriodEvents = (tickets: Ticket[], startDate: Date, endDate: Date) => {
          const eventSet = new Set<number>();
          tickets.forEach(ticket => {
            const ticketDate = new Date(ticket.createdAt);
            if (ticketDate >= startDate && ticketDate <= endDate) {
              eventSet.add(ticket.eventId);
            }
          });
          return eventSet.size;
        };

        const currentEvents = calculatePeriodEvents(orgTickets, thirtyDaysAgo, now);
        const previousEvents = calculatePeriodEvents(orgTickets, sixtyDaysAgo, thirtyDaysAgo);

        // Calculate trends
        const calculateTrend = (current: number, previous: number) => {
          if (previous === 0) return 0;
          return ((current - previous) / previous) * 100;
        };

        const revenueTrend = calculateTrend(currentRevenue, previousRevenue);
        const eventsTrend = calculateTrend(currentEvents, previousEvents);
        const ticketsTrend = calculateTrend(currentTickets, previousTickets);

        // Calculate average ticket price and its trend
        const currentAvgPrice = currentTickets > 0 ? currentRevenue / currentTickets : 0;
        const previousAvgPrice = previousTickets > 0 ? previousRevenue / previousTickets : 0;
        const priceTrend = calculateTrend(currentAvgPrice, previousAvgPrice);

        // Calculate total stats
        const totalRevenue = calculatePeriodRevenue(orgTickets, new Date(0), now);
        const totalTickets = orgTickets.length;
        const avgTicketPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;

        setStats({
          totalRevenue,
          totalEvents: orgEvents.length,
          totalTickets,
          avgTicketPrice,
          revenueTrend,
          eventsTrend,
          ticketsTrend,
          priceTrend
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [organizationId]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${stats.totalRevenue.toLocaleString()}
          </CardTitle>
          <CardAction>
            <TrendBadge isUptrend={stats.revenueTrend > 0} value={`${stats.revenueTrend > 0 ? '+' : ''}${stats.revenueTrend.toFixed(1)}%`}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.revenueTrend > 0 ? 'Revenue increasing' : 'Revenue decreasing'} 
            {stats.revenueTrend > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Compared to previous 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Events</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalEvents}
          </CardTitle>
          <CardAction>
            <TrendBadge isUptrend={stats.eventsTrend > 0} value={`${stats.eventsTrend > 0 ? '+' : ''}${stats.eventsTrend.toFixed(1)}%`}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.eventsTrend > 0 ? 'Events growing' : 'Events declining'}
            {stats.eventsTrend > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Compared to previous 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Tickets</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.totalTickets.toLocaleString()}
          </CardTitle>
          <CardAction>
            <TrendBadge isUptrend={stats.ticketsTrend > 0} value={`${stats.ticketsTrend > 0 ? '+' : ''}${stats.ticketsTrend.toFixed(1)}%`}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.ticketsTrend > 0 ? 'Ticket sales up' : 'Ticket sales down'}
            {stats.ticketsTrend > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Compared to previous 30 days
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average Ticket Price</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${stats.avgTicketPrice.toFixed(2)}
          </CardTitle>
          <CardAction>
            <TrendBadge isUptrend={stats.priceTrend > 0} value={`${stats.priceTrend > 0 ? '+' : ''}${stats.priceTrend.toFixed(1)}%`}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {stats.priceTrend > 0 ? 'Prices increasing' : 'Prices stable'}
            {stats.priceTrend > 0 ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Compared to previous 30 days
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
