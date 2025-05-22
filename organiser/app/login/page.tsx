"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"

interface Organization {
  eventOrgId: number;
  name: string;
  description: string;
  contact: string;
  events: number[];
  users: number[] | null;
  createdAt: string;
  updatedAt: string;
}

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    if (isLoggedIn === 'true') {
      router.push('/home')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // First authenticate the user
      const authRes = await fetch(
        `https://www.api.ticketexpert.me/api/users/auth?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      )

      if (!authRes.ok) {
        const data = await authRes.json()
        setError(data.error || "Login failed.")
        return
      }

      // Then fetch all users to find the matching user
      const usersRes = await fetch('https://api.ticketexpert.me/api/users')
      if (!usersRes.ok) {
        throw new Error('Failed to fetch users')
      }

      const users = await usersRes.json()
      const user = users.find((u: any) => u.email === formData.email)

      if (!user) {
        setError("User not found")
        return
      }

      console.log('Found user:', user)

      // Fetch organizations to find the matching organization
      const orgsRes = await fetch('https://api.ticketexpert.me/api/organisations')
      if (!orgsRes.ok) {
        throw new Error('Failed to fetch organizations')
      }

      const organizations: Organization[] = await orgsRes.json()
      console.log('All organizations:', organizations)

      // Try to find organization by users array first
      let userOrg = organizations.find(org => 
        org.users && org.users.includes(user.userId)
      )

      // If not found in users array, try to find by eventOrgId
      if (!userOrg && user.eventOrgId) {
        userOrg = organizations.find(org => 
          org.eventOrgId === user.eventOrgId
        )
      }

      console.log('Found organization:', userOrg)

      if (!userOrg) {
        console.warn('No organization found for user:', user)
        setError("No organization found for this user")
        return
      }

      // Clear any existing data first
      localStorage.clear()

      // Store user data in localStorage
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', user.userId.toString())
      localStorage.setItem('userRole', user.role)
      
      // Store organization data
      const orgId = userOrg.eventOrgId.toString()
      localStorage.setItem('organizationId', orgId)
      localStorage.setItem('organizationName', userOrg.name)
      
      console.log('Stored organization data:', {
        id: orgId,
        name: userOrg.name
      })

      // Verify the data was stored
      const storedOrgId = localStorage.getItem('organizationId')
      console.log('Stored organization ID:', storedOrgId)

      if (!storedOrgId) {
        setError("Failed to store organization data")
        return
      }

      // Double check the organization ID is correct
      if (storedOrgId !== orgId) {
        setError("Organization ID mismatch")
        return
      }

      router.push("/home")
    } catch (err) {
      console.error('Login error:', err)
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-[#f5f5f5]">
      <div className="w-[70vw] h-[80vh] flex rounded-2xl overflow-hidden shadow-lg">
        {/* Left Side */}
        <div className="w-[60%] bg-gradient-to-br from-[#004AAD] to-[#00B893] flex flex-col items-start p-8">
          <TELogo />
        </div>

        {/* Right Side */}
        <div className="w-[60%] bg-white flex flex-col justify-start items-start p-12">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            Back to your<br />
            Organiser Account
          </h2>

          <form onSubmit={handleSubmit} className="w-full">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="h-14"
                disabled={isLoading}
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-14"
                disabled={isLoading}
              />

              <Button
                type="submit"
                className="w-[300px] h-[50px] bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-full font-bold mt-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Logging in...</span>
                  </div>
                ) : (
                  "Log In"
                )}
              </Button>
            </div>

            <div className="w-full h-px bg-gray-200 my-6" />

            <p className="text-[#1e40af] mt-2">
              New to TicketExpert?{" "}
              <Link href="/signup" className="text-[#1e40af] font-bold hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}