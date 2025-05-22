"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TELogo from "@/components/logo"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"
import Cookies from 'js-cookie'
import { useAuth } from "@/contexts/auth-context"

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

function getStrengthLabel(score: number) {
  switch (score) {
    case 0: return { label: "Very Weak", color: "destructive" };
    case 1: return { label: "Weak", color: "orange" };
    case 2: return { label: "Fair", color: "yellow" };
    case 3: return { label: "Good", color: "blue" };
    case 4: return { label: "Strong", color: "green" };
    case 5: return { label: "Very Strong", color: "green" };
    default: return { label: "Very Weak", color: "destructive" };
  }
}

export default function SignupPage() {
  const router = useRouter()
  const { setUserId, setUser } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields.")
      setIsLoading(false)
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      setIsLoading(false)
      return
    }
    if (getPasswordStrength(formData.password) < 3) {
      setError("Password is too weak. Please use a stronger password.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("https://www.api.ticketexpert.me/api/users", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password,
          role: "Organiser",
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        if (res.status === 401 && data.error === "User already exists") {
          setError("User already exists. Please use a different email.")
        } else if (res.status === 400) {
          setError(data.error || "Invalid input. Please check your details.")
        } else if (res.status === 500) {
          setError("Server error. Please try again later.")
        } else {
          setError(data.error || "Signup failed. Please try again.")
        }
        setIsLoading(false)
        return
      }

      // Set auth state using context
      setUserId(data.userId.toString())
      setUser({
        id: data.userId.toString(),
        token: data.token,
        email: data.email,
        name: data.name
      })

      // Store auth data in cookies
      Cookies.set('userId', data.userId.toString(), { expires: 7 })
      Cookies.set('userRole', 'Organiser', { expires: 7 })
      Cookies.set('token', data.token, { expires: 7 })

      setSuccess("Account created successfully!")
      
      // Redirect to organiser details page
      router.push("/signup/organiser-details")
    } catch (err) {
      console.error('Signup error:', err)
      setError("Unable to connect to the server. Please check your internet connection and try again.")
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(passwordStrength)

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
            Create your 
            <br/>
            Organiser Account
          </h2>

          <form onSubmit={handleSubmit} className="w-full max-w-[400px]">
          <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="h-14"
                  disabled={isLoading}
                />
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="h-14"
                  disabled={isLoading}
                />
              </div>

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

              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Password Strength:</span>
                    <span className={`text-sm font-bold text-${strengthColor}`}>
                      {strengthLabel}
                    </span>
                  </div>
                  <Progress value={(passwordStrength / 5) * 100} className="h-2.5" />
                </div>
              )}

              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-14"
                disabled={isLoading}
              />

              {/* Password Requirements */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>At least 8 characters</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>At least one uppercase letter</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>At least one number</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className={`w-4 h-4 ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : 'text-gray-300'}`} />
                  <span>At least one special character</span>
              </div>
            </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="bg-green-50 text-green-800 border-green-200">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-[50px] bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-full font-bold text-lg tracking-wide shadow-[0_2px_8px_rgba(30,64,175,0.10)]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Account...</span>
            </div>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </div>

            <div className="w-full h-px bg-gray-200 my-6" />

            <p className="text-[#1e40af] text-center">
              Already have a TicketExpert account?{" "}
              <Link href="/login" className="text-[#1e40af] font-bold hover:underline">
                Log in
            </Link>
          </p>
          </form>
        </div>
      </div>
    </div>
  )
}