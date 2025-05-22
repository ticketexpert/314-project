"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"
import { useAuth } from "@/app/hooks/useAuth"

interface Organization {
  eventOrgId: number
  name: string
  description: string
  contact: string
  events: number[]
  users: string[] | null
  createdAt: string
  updatedAt: string
}

// Helper function to make API calls with retry
async function fetchWithRetry(url: string, options: RequestInit, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
    }
  }
  throw new Error("Failed after retries")
}

export default function OrganiserDetailsPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [eventOrgId, setEventOrgId] = useState("")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  // Check for userId on component mount
  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')
    
    if (!userId || userRole !== 'Organiser') {
      router.push('/signup')
    }
  }, [router])

  const handleSearch = async () => {
    if (!eventOrgId) {
      setError("Please enter an Organization ID")
      return
    }

    setIsSearching(true)
    setError("")

    try {
      console.log('Searching for organization:', eventOrgId)
      const res = await fetchWithRetry(
        `https://api.ticketexpert.me/api/organisations/${eventOrgId}`,
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      )

      console.log('Search response status:', res.status)
      console.log('Search response headers:', Object.fromEntries(res.headers.entries()))

      // Check if response is JSON
      const contentType = res.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const text = await res.text()
        console.error('Non-JSON response:', text)
        throw new Error("Server returned non-JSON response")
      }

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Search error response:', errorData)
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      console.log('Organization data:', data)
      setOrganization(data)
    } catch (err) {
      console.error('Search error:', err)
      if (err instanceof Error) {
        if (err.message.includes("non-JSON response")) {
          setError("Server error. Please try again later.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to fetch organization details")
      }
      setOrganization(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organization) return

    setIsLoading(true)
    setError("")

    try {
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      
      if (!userId || userRole !== 'Organiser') {
        throw new Error("User data not found. Please try signing up again.")
      }

      console.log('Updating organization:', organization.eventOrgId)
      // Update organization with user using PATCH as per backend route
      const updateOrgRes = await fetchWithRetry(
        `https://api.ticketexpert.me/api/organisations/${organization.eventOrgId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            users: [...(organization.users || []), userId]
          }),
        }
      )

      console.log('Organization update response status:', updateOrgRes.status)
      console.log('Organization update response headers:', Object.fromEntries(updateOrgRes.headers.entries()))

      // Check if response is JSON
      const orgContentType = updateOrgRes.headers.get("content-type")
      if (!orgContentType || !orgContentType.includes("application/json")) {
        const text = await updateOrgRes.text()
        console.error('Non-JSON response for organization update:', text)
        throw new Error("Server returned non-JSON response when updating organization")
      }

      if (!updateOrgRes.ok) {
        const errorData = await updateOrgRes.json()
        console.error('Organization update error response:', errorData)
        throw new Error(errorData.message || `Failed to update organization: ${updateOrgRes.status}`)
      }

      // Save organization ID to localStorage
      localStorage.setItem('organizationId', organization.eventOrgId.toString())
      
      // Redirect to dashboard after successful creation
      router.push('/dashboard')
    } catch (err) {
      console.error('Submit error:', err)
      if (err instanceof Error) {
        if (err.message.includes("non-JSON response")) {
          setError("Server error. Please try again later.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Network error. Please try again.")
      }
      if (err instanceof Error && err.message.includes("User data not found")) {
        router.push('/signup')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-[#f5f5f5]">
      <div className="w-[70vw] max-w-[90vw] flex rounded-[20px] overflow-hidden shadow-[0_8px_32px_rgba(3,58,166,0.10)]">
        {/* Left Side */}
        <div className="w-[50%] bg-gradient-to-br from-[#004AAD] to-[#00B893] flex flex-col items-end p-8 hidden md:flex">
          <TELogo className="w-[120px] mb-0" />
        </div>

        {/* Right Side */}
        <div className="w-full md:w-[55%] bg-white flex flex-col justify-start items-start p-6 md:p-12">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            Link your<br />
            Organization
          </h2>

          <div className="w-full max-w-[400px] space-y-6">
            {/* Search Section */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Enter Organization ID"
                  value={eventOrgId}
                  onChange={(e) => setEventOrgId(e.target.value)}
                  className="h-14"
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="h-14 px-6 bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-full font-bold"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Organization Details */}
            {organization && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Organization Name</label>
                    <p className="text-lg font-semibold text-gray-900">{organization.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="text-gray-900">{organization.description}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contact</label>
                    <p className="text-gray-900">{organization.contact}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Events</label>
                    <p className="text-gray-900">{organization.events.length} event(s)</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Current Members</label>
                    <p className="text-gray-900">{organization.users?.length || 0} member(s)</p>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-[50px] bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-full font-bold text-lg tracking-wide shadow-[0_2px_8px_rgba(30,64,175,0.10)]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Linking Account...</span>
                    </div>
                  ) : (
                    "Link Account"
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 