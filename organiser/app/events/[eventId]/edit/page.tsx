"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { EventForm } from "@/components/event-form"

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
  pricing: {
    type: string;
    price: number;
    numTicketsAvailable: number;
  }[];
  refundPolicy: string;
  eventOrgId: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventId = params?.eventId
        if (!eventId) {
          throw new Error('Event ID not found')
        }

        // Check if user is logged in and has organization ID
        const organizationId = localStorage.getItem('organizationId')
        if (!organizationId) {
          router.push('/login')
          return
        }

        console.log('Fetching event:', eventId) // Debug log

        // Fetch event details
        const response = await fetch(`https://api.ticketexpert.me/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }

        const eventData = await response.json()
        console.log('Fetched event data:', eventData) // Debug log
        
        // Verify the event belongs to the organization
        if (eventData.eventOrgId.toString() !== organizationId) {
          router.push('/home')
          return
        }

        // Format dates for the form
        const formattedEvent = {
          ...eventData,
          fromDateTime: new Date(eventData.fromDateTime).toISOString().split('.')[0],
          toDateTime: new Date(eventData.toDateTime).toISOString().split('.')[0],
        }

        setEvent(formattedEvent)
      } catch (error) {
        console.error('Error fetching event:', error)
        setError(error instanceof Error ? error.message : 'Failed to load event')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [params, router])

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <Button 
          onClick={handleBack}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Event Not Found</h2>
        <p className="text-gray-600">The event you are trying to edit does not exist.</p>
        <Button 
          onClick={handleBack}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-[#004AAD]"
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#004AAD] mb-8">Edit Event</h1>
        <EventForm event={event} mode="edit" />
      </div>
    </div>
  )
} 