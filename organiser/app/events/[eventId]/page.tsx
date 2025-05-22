"use client"

import { EventDetail } from "@/components/event-detail"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyEvent = async () => {
      try {
        // Check if user is logged in and has organization ID
        const organizationId = localStorage.getItem('organizationId')
        if (!organizationId) {
          router.push('/login')
          return
        }

        // Get eventId from params
        const eventId = params?.eventId
        if (!eventId) {
          setError('Event ID not found')
          return
        }

        console.log('Fetching event:', eventId) // Debug log

        // Verify the event belongs to the organization
        const response = await fetch(`https://api.ticketexpert.me/api/events/${eventId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event')
        }
        
        const event = await response.json()
        console.log('Fetched event:', event) // Debug log
        
        if (event.eventOrgId.toString() !== organizationId) {
          router.push('/home')
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Error verifying event:', error)
        setError(error instanceof Error ? error.message : 'Failed to load event')
      }
    }

    verifyEvent()
  }, [params, router])

  const handleEditEvent = () => {
    router.push(`/events/${params.eventId}/edit`)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
        <p className="text-gray-600">{error}</p>
        <button 
          onClick={() => router.push('/home')}
          className="mt-4 px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#003d8f]"
        >
          Return to Home
        </button>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-[#004AAD]"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
      <EventDetail onEditEvent={handleEditEvent} />
    </div>
  )
} 