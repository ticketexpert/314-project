"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { setUserId, setOrganizationId, setUser } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
        `https://api.ticketexpert.me/api/users/auth?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      )

      if (!authRes.ok) {
        const data = await authRes.json()
        throw new Error(data.error || "Login failed")
      }

      const userData = await authRes.json()

      // Check if user is an organiser
      if (userData.role !== "Organiser") {
        throw new Error("Access denied. Only organisers can access this portal.")
      }

      // Fetch organization data
      const orgRes = await fetch(`https://api.ticketexpert.me/api/organisations/${userData.eventOrgId}`)
      if (!orgRes.ok) {
        throw new Error("Failed to fetch organization data")
      }

      const orgData = await orgRes.json()

      // Set auth state using context
      setUserId(userData.userId.toString())
      setOrganizationId(userData.eventOrgId.toString())

      // Set user data in context
      setUser({
        id: userData.userId.toString(),
        token: userData.token || "dummy-token", // Add a token if your API provides one
        email: userData.email,
        name: userData.name
      })

      // Redirect to home
      router.push("/home")
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : "An error occurred during login")
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