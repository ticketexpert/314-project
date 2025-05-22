"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const res = await fetch(
        `https://www.api.ticketexpert.me/api/users/auth?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      )
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Login failed.")
        return
      }
      const user = await res.json()
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userId', user.userId || user.id)
      router.push("/dashboard")
    } catch (err) {
      setError("Network error. Please try again.")
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
              />

              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-14"
              />

              <Button
                type="submit"
                className="w-[300px] h-[50px] bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-full font-bold mt-6"
              >
                Log In
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