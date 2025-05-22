"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Cookies from 'js-cookie'

export function LoginForm() {
  const router = useRouter()
  const { setUserId, setOrganizationId, setUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("https://api.ticketexpert.me/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Check if user is an organiser
      if (data.role !== "Organiser") {
        throw new Error("Access denied. Only organisers can access this portal.")
      }

      // Set auth state using context
      setUserId(data.userId.toString())
      if (data.organizationId) {
        setOrganizationId(data.organizationId.toString())
      }

      // Set user data in context
      setUser({
        id: data.userId.toString(),
        token: data.token,
        email: data.email,
        name: data.name
      })

      // Store auth data in cookies
      Cookies.set('userId', data.userId.toString(), { expires: 7 }) // 7 days expiry
      Cookies.set('userRole', data.role, { expires: 7 })
      Cookies.set('token', data.token, { expires: 7 })
      if (data.organizationId) {
        Cookies.set('organizationId', data.organizationId.toString(), { expires: 7 })
      }

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-[#034AA6] hover:bg-[#023a8a] transition-colors"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Logging in...</span>
          </div>
        ) : (
          "Login"
        )}
      </Button>
    </form>
  )
} 