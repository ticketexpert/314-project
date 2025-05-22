"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Organization {
  orgId: number
  name: string
  description: string
  contact: string
  email: string
  follow: string[]
}

export function Settings() {
  const router = useRouter()
  const { toast } = useToast()
  const { organizationId } = useAuth()
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!organizationId) {
          throw new Error("Organization ID not found")
        }

        const response = await fetch(`https://api.ticketexpert.me/api/organisations/${organizationId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(
            errorData?.message || 
            `Failed to fetch organization details: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()
        
        if (!data || !data.eventOrgId) {
          throw new Error("Invalid organization data received")
        }

        const organization: Organization = {
          orgId: data.eventOrgId,
          name: data.name,
          description: data.description,
          contact: data.contact,
          email: data.contact,
          follow: []
        }

        setOrganization(organization)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load organization details"
        console.error("Error fetching organization:", errorMessage)
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganization()
  }, [organizationId, toast])

  const handleSave = async () => {
    if (!organization) return

    try {
      const response = await fetch(`https://api.ticketexpert.me/api/organisations/${organization.orgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventOrgId: organization.orgId,
          name: organization.name,
          description: organization.description,
          contact: organization.contact,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          `Failed to update organization details: ${response.status} ${response.statusText}`
        )
      }

      toast({
        title: "Success",
        description: "Organization details updated successfully",
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update organization details"
      console.error("Error updating organization:", errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!organization) {
    return <div>No organization found</div>
  }

  return (
    <div className="space-y-6">
          <div>
        <h3 className="text-lg font-medium">Organization Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your organization details and preferences.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Organization Name</Label>
          <Input
            id="name"
            value={organization.name}
            onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={organization.email}
            onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={organization.description}
            onChange={(e) => setOrganization({ ...organization, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact">Contact Information</Label>
          <Textarea
            id="contact"
            value={organization.contact}
            onChange={(e) => setOrganization({ ...organization, contact: e.target.value })}
            rows={2}
          />
          </div>

        <Button onClick={handleSave}>Save Changes</Button>
          </div>
    </div>
  )
}