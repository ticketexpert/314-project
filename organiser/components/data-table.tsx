"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"

interface Pricing {
  type: string
  price: number
  numTicketsAvailable: number
}

interface Event {
  eventId: number
  title: string
  category: string
  tags: string[]
  image: string
  description: string
  fromDateTime: string
  toDateTime: string
  region: string
  venue: string
  pricing: Pricing[]
  refundPolicy: string
  organiser: string
  eventOrgId: number
  orgDescription: string
  orgContact: string
  orgFollow: string[]
  eventShareLinks: string[]
  createdAt: string
  updatedAt: string
}

export function DataTable() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Get organization ID from localStorage
        const organizationId = localStorage.getItem('organizationId')
        if (!organizationId) {
          throw new Error("Organization ID not found")
        }

        // Fetch all events
        const eventsResponse = await fetch('https://api.ticketexpert.me/api/events')
        if (!eventsResponse.ok) {
          throw new Error('Failed to fetch events')
        }
        const allEvents: Event[] = await eventsResponse.json()

        // Filter events for this organization
        const orgEvents = allEvents.filter(event => event.eventOrgId === parseInt(organizationId))
        setEvents(orgEvents)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return <div>Loading events...</div>
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Available Tickets</TableHead>
            <TableHead>Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => {
            // Calculate total available tickets and value
            const totalTickets = event.pricing.reduce((sum, tier) => sum + tier.numTicketsAvailable, 0)
            const totalValue = event.pricing.reduce((sum, tier) => sum + (tier.price * tier.numTicketsAvailable), 0)

            return (
              <TableRow key={event.eventId}>
                <TableCell>
                  {format(new Date(event.fromDateTime), "MMM d, yyyy")}
                </TableCell>
                <TableCell>{event.venue}, {event.region}</TableCell>
                <TableCell>{event.title}</TableCell>
                <TableCell className="capitalize">{event.category}</TableCell>
                <TableCell>{totalTickets}</TableCell>
                <TableCell>${totalValue.toLocaleString()}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}