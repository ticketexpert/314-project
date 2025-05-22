"use client"

import { useState, useEffect } from "react"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface Organization {
  orgId: number
  name: string
  description: string
  contact: string
  email: string
  follow: string[]
}

export default function Page() {
  const [tabValue, setTabValue] = useState("overview")
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const { organizationId } = useAuth()

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!organizationId) {
          throw new Error("Organization ID not found")
        }

        console.log("Fetching organization with ID:", organizationId)
        const response = await fetch(`https://api.ticketexpert.me/api/organisations/${organizationId}`)
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(
            errorData?.message || 
            `Failed to fetch organization details: ${response.status} ${response.statusText}`
          )
        }

        const data = await response.json()
        console.log("Received organization data:", data)
        
        if (!data || !data.eventOrgId) {
          throw new Error("Invalid organization data received")
        }

        // Map the API response to our interface
        const organization: Organization = {
          orgId: data.eventOrgId,
          name: data.name,
          description: data.description,
          contact: data.contact,
          email: data.contact, // Using contact as email since it's not in the API response
          follow: [] // Initialize as empty array since it's not in the API response
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

    if (tabValue === "organisation-profile") {
      fetchOrganization()
    }
  }, [tabValue, toast, organizationId])

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
          // Note: email and follow are not part of the API schema
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.message || 
          `Failed to update organization details: ${response.status} ${response.statusText}`
        )
      }

      setIsEditing(false)
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

  return (
    <>
      <SiteHeader tabValue={tabValue} setTabValue={setTabValue}/>
      <div className="flex flex-1 flex-col gap-2 py-8">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {tabValue === "overview" && (
              <>
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable />
              </>
            )}

            {tabValue === "organisation-profile" && (
              <div className="px-4 lg:px-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-[#034AA6]">Organization Profile</h2>
                  <Button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    variant={isEditing ? "default" : "outline"}
                    disabled={isLoading}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="space-y-4">
                    <Card className="animate-pulse">
                      <CardHeader>
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </CardHeader>
                      <CardContent>
                        <div className="h-8 w-32 bg-gray-200 rounded" />
                      </CardContent>
                    </Card>
                  </div>
                ) : error ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-red-500 space-y-2">
                        <p className="font-semibold">Error loading organization details:</p>
                        <p>{error}</p>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setError("")
                            setIsLoading(true)
                            // Trigger a re-fetch
                            setTabValue("overview")
                            setTimeout(() => setTabValue("organisation-profile"), 0)
                          }}
                        >
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : organization ? (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Organization Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Organization Name</label>
                          {isEditing ? (
                            <Input
                              value={organization.name}
                              onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                            />
                          ) : (
                            <p className="text-lg">{organization.name}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          {isEditing ? (
                            <Input
                              value={organization.email}
                              onChange={(e) => setOrganization({ ...organization, email: e.target.value })}
                              type="email"
                            />
                          ) : (
                            <p className="text-lg">{organization.email}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Description</label>
                          {isEditing ? (
                            <Textarea
                              value={organization.description}
                              onChange={(e) => setOrganization({ ...organization, description: e.target.value })}
                              rows={4}
                            />
                          ) : (
                            <p className="text-lg whitespace-pre-wrap">{organization.description}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Contact Information</label>
                          {isEditing ? (
                            <Textarea
                              value={organization.contact}
                              onChange={(e) => setOrganization({ ...organization, contact: e.target.value })}
                              rows={2}
                            />
                          ) : (
                            <p className="text-lg whitespace-pre-wrap">{organization.contact}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Social Media Links</label>
                          {isEditing ? (
                            <Textarea
                              value={organization.follow.join('\n')}
                              onChange={(e) => setOrganization({ ...organization, follow: e.target.value.split('\n') })}
                              rows={3}
                              placeholder="Enter each social media link on a new line"
                            />
                          ) : (
                            <div className="space-y-1">
                              {organization.follow.map((link, index) => (
                                <p key={index} className="text-lg">
                                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    {link}
                                  </a>
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}