"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SalesTable } from "@/components/sales-table"
import { format } from "date-fns"

interface Ticket {
  ticketId: string
  eventId: number
  userId: number
  locationDetails: {
    section: string
    row: string
    seat: string
  }
  ticketStatus: string
  ticketType: string
  orderNumber: string
  createdAt: string
  updatedAt: string
}

interface Event {
  eventId: number
  title: string
  category: string
  eventOrgId: number
  pricing: {
    type: string
    price: number
    numTicketsAvailable: number
  }[]
}

interface SalesStats {
  totalTickets: number
  totalRevenue: number
  averageTicketPrice: number
  ticketsByType: Record<string, number>
}

interface TableData {
  date: string
  location: string
  event: string
  category: string
  sold: number
  gross: string
}

export default function SalesPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [events, setEvents] = useState<Record<number, Event>>({})
  const [stats, setStats] = useState<SalesStats>({
    totalTickets: 0,
    totalRevenue: 0,
    averageTicketPrice: 0,
    ticketsByType: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organizationId = localStorage.getItem('organizationId')
        if (!organizationId) {
          throw new Error("Organization ID not found")
        }

        // Fetch events first to get pricing information
        const eventsResponse = await fetch('https://api.ticketexpert.me/api/events')
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events')
        }
        const eventsData: Event[] = await eventsResponse.json()
        
        // Filter events for this organization and create a lookup map
        const orgEvents = eventsData.filter(event => event.eventOrgId === parseInt(organizationId))
        const eventsMap = orgEvents.reduce((acc, event) => {
          acc[event.eventId] = event
          return acc
        }, {} as Record<number, Event>)
        setEvents(eventsMap)

        // Fetch tickets
        const ticketsResponse = await fetch('https://api.ticketexpert.me/api/tickets')
        if (!ticketsResponse.ok) {
          throw new Error('Failed to fetch tickets')
        }
        const ticketsData: Ticket[] = await ticketsResponse.json()

        // Filter tickets for events belonging to this organization
        const orgTickets = ticketsData.filter(ticket => eventsMap[ticket.eventId])
        setTickets(orgTickets)

        // Calculate statistics
        const ticketsByType: Record<string, number> = {}
        let totalRevenue = 0

        orgTickets.forEach(ticket => {
          const event = eventsMap[ticket.eventId]
          const pricing = event.pricing.find(p => p.type === ticket.ticketType)
          
          if (pricing) {
            totalRevenue += pricing.price
            ticketsByType[ticket.ticketType] = (ticketsByType[ticket.ticketType] || 0) + 1
          }
        })

        setStats({
          totalTickets: orgTickets.length,
          totalRevenue,
          averageTicketPrice: orgTickets.length > 0 ? totalRevenue / orgTickets.length : 0,
          ticketsByType
        })

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load sales data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
        <div className="w-full px-4 py-10 space-y-10">
            <h1 className="text-4xl font-bold text-[#034AA6]">Sales</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-32 bg-gray-200 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full px-4 py-10 space-y-10">
        <h1 className="text-4xl font-bold text-[#034AA6]">Sales</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    )
  }

  const tableData: TableData[] = tickets.map(ticket => ({
    date: format(new Date(ticket.createdAt), "MMM d, yyyy"),
    location: `${ticket.locationDetails.section}${ticket.locationDetails.row}${ticket.locationDetails.seat}`,
    event: events[ticket.eventId]?.title || "Unknown Event",
    category: events[ticket.eventId]?.category || "Unknown",
    sold: 1,
    gross: `$${events[ticket.eventId]?.pricing.find(p => p.type === ticket.ticketType)?.price || 0}`
  }))

  return (
    <div className="w-full px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-[#034AA6]">Sales</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Tickets Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Ticket Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.averageTicketPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Type Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.ticketsByType).map(([type, count]) => (
              <div key={type} className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">{type}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesTable data={tableData} />
        </CardContent>
      </Card>
        </div>
    )
}