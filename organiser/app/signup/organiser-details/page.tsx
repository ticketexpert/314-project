"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"
import Cookies from 'js-cookie'

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
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
  }
  throw new Error("Failed after retries")
}

export default function OrganiserDetailsPage() {
  const router = useRouter()
  const { setUserId, setOrganizationId, setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [eventOrgId, setEventOrgId] = useState("")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const userId = Cookies.get('userId')
    const userRole = Cookies.get('userRole')
    
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
      const res = await fetchWithRetry(
        `https://api.ticketexpert.me/api/organisations/${eventOrgId}`,
        {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setOrganization(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
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
      const userId = Cookies.get('userId')
      const userRole = Cookies.get('userRole')
      const token = Cookies.get('token')
      
      if (!userId || userRole !== 'Organiser' || !token) {
        throw new Error("User data not found. Please try signing up again.")
      }

      console.log('Sending request with:', {
        organizationId: organization.eventOrgId,
        userId,
        currentUsers: organization.users
      })

      // First, update the user's eventOrgId
      const updateUserRes = await fetchWithRetry(
        `https://api.ticketexpert.me/api/users/${userId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            eventOrgId: organization.eventOrgId
          }),
        }
      )

      if (!updateUserRes.ok) {
        const userError = await updateUserRes.json()
        throw new Error(userError.message || 'Failed to update user')
      }

      // Then, update the organization's users array
      const updateOrgRes = await fetchWithRetry(
        `https://api.ticketexpert.me/api/organisations/${organization.eventOrgId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            users: [...(organization.users || []), userId]
          }),
        }
      )

      const responseData = await updateOrgRes.json()
      console.log('API Response:', responseData)

      if (!updateOrgRes.ok) {
        throw new Error(responseData.message || `Failed to update organization: ${updateOrgRes.status}`)
      }

      // Update auth context
      setOrganizationId(organization.eventOrgId.toString())
      
      // Save organization ID to cookies
      Cookies.set('organizationId', organization.eventOrgId.toString(), { expires: 7 })
      
      // Redirect to dashboard
      router.push('/home')
    } catch (err) {
      console.error('Error updating organization:', err)
      if (err instanceof Error) {
        setError(err.message)
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