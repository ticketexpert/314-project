"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface User {
  userId: number
  firstName: string
  lastName: string
  email: string
  role: string
  eventOrgId: number | null
}

interface Organization {
  eventOrgId: number
  name: string
  description: string
  contact: string
  events: number[]
  users: number[] | null
}

export default function ProfileInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error("User ID not found")
        }

        // Fetch user data
        const userResponse = await fetch(`https://api.ticketexpert.me/api/users/${userId}`)
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data')
        }
        const userData: User = await userResponse.json()
        setUser(userData)

        // Fetch organization data if user has an organization
        if (userData.eventOrgId) {
          const orgResponse = await fetch('https://api.ticketexpert.me/api/organisations')
          if (!orgResponse.ok) {
            throw new Error('Failed to fetch organization data')
          }
          const organizations: Organization[] = await orgResponse.json()
          const userOrg = organizations.find(org => org.eventOrgId === userData.eventOrgId)
          if (userOrg) {
            setOrganization(userOrg)
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load profile data"
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg">Profile Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return null
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Profile Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" alt="Profile" />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-semibold text-lg">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground capitalize">Role: {user.role}</p>
            <Button variant="outline" className="mt-2">Edit Profile</Button>
          </div>
        </div>

        {organization && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Organization Details</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Name:</span> {organization.name}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Description:</span> {organization.description}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Contact:</span> {organization.contact}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}