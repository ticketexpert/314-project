"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, isAfter, isBefore } from "date-fns"
import { CalendarIcon, AlertCircle, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Pricing {
  type: string
  price: number
  numTicketsAvailable: number
}

interface FormErrors {
  title?: string
  category?: string
  tags?: string
  image?: string
  description?: string
  fromDateTime?: string
  toDateTime?: string
  region?: string
  venue?: string
  pricing?: string
  refundPolicy?: string
  orgDescription?: string
  orgContact?: string
}

interface Organization {
  eventOrgId: number
  name: string
  description: string
  contact: string
  email: string
  users: number[]
  events: number[]
}

interface EventFormProps {
  event?: {
    eventId: number;
    title: string;
    category: string;
    tags: string[];
    image: string;
    description: string;
    fromDateTime: string;
    toDateTime: string;
    region: string;
    venue: string;
    pricing: {
      type: string;
      price: number;
      numTicketsAvailable: number;
    }[];
    refundPolicy: string;
    eventOrgId: number;
  } | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}



const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const isValidPhoneNumber = (phone: string): boolean => {
  return /^\+?[\d\s-]{8,}$/.test(phone);
}

const hasDuplicatePricingTypes = (pricing: Pricing[]): boolean => {
  const types = pricing.map(p => p.type.toLowerCase());
  return new Set(types).size !== types.length;
}

export function EventForm({ event, mode, onSuccess }: EventFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const { organizationId } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [eventData, setEventData] = useState({
    title: event?.title || "",
    category: event?.category || "",
    tags: event?.tags || [],
    image: event?.image || "",
    description: event?.description || "",
    fromDateTime: event ? new Date(event.fromDateTime) : new Date(),
    toDateTime: event ? new Date(event.toDateTime) : new Date(new Date().setHours(new Date().getHours() + 1)),
    region: event?.region || "",
    venue: event?.venue || "",
    pricing: event?.pricing || [],
    refundPolicy: event?.refundPolicy || "",
    organiser: "",
    eventOrgId: event?.eventOrgId || 0,
    orgDescription: "",
    orgContact: "",
    orgEmail: ""
  })

  const [currentPricing, setCurrentPricing] = useState<Pricing>({
    type: "",
    price: 0,
    numTicketsAvailable: 0
  })

  // Fetch organization data
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        if (!organizationId) {
          throw new Error('Organization ID not found')
        }

        const response = await fetch(`https://api.ticketexpert.me/api/organisations/${organizationId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch organization')
        }
        const data = await response.json()
        setOrganization(data)
        setEventData(prev => ({
          ...prev,
          organiser: data.name,
          eventOrgId: data.eventOrgId,
          orgDescription: data.description,
          orgContact: data.contact,
          orgEmail: data.contact
        }))
      } catch (error) {
        console.error('Error fetching organization:', error)
        setError(error instanceof Error ? error.message : 'Failed to load organization')
      }
    }

    fetchOrganization()
  }, [organizationId])

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    const now = new Date()
    
    if (!eventData.title.trim()) {
      newErrors.title = "Event title is required"
    } else if (eventData.title.length < 3) {
      newErrors.title = "Event title must be at least 3 characters long"
    }

    if (!eventData.category) {
      newErrors.category = "Category is required"
    }

    if (eventData.tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    } else if (eventData.tags.some(tag => tag.length < 2)) {
      newErrors.tags = "Each tag must be at least 2 characters long"
    }

    if (!eventData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (eventData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters long"
    }

    if (!eventData.region.trim()) {
      newErrors.region = "Region is required"
    }

    if (!eventData.venue.trim()) {
      newErrors.venue = "Venue is required"
    }

    if (eventData.pricing.length === 0) {
      newErrors.pricing = "At least one pricing tier is required"
    } else if (hasDuplicatePricingTypes(eventData.pricing)) {
      newErrors.pricing = "Duplicate pricing types are not allowed"
    }

    if (!eventData.refundPolicy.trim()) {
      newErrors.refundPolicy = "Refund policy is required"
    } else if (eventData.refundPolicy.length < 10) {
      newErrors.refundPolicy = "Refund policy must be at least 10 characters long"
    }

    if (!eventData.orgDescription.trim()) {
      newErrors.orgDescription = "Organization description is required"
    } else if (eventData.orgDescription.length < 10) {
      newErrors.orgDescription = "Organization description must be at least 10 characters long"
    }

    if (!eventData.orgContact.trim()) {
      newErrors.orgContact = "Organization contact is required"
    } else if (!isValidEmail(eventData.orgContact) && !isValidPhoneNumber(eventData.orgContact)) {
      newErrors.orgContact = "Please enter a valid email address or phone number"
    }

    // Date validation
    if (isBefore(eventData.fromDateTime, now)) {
      newErrors.fromDateTime = "Start date must be in the future"
    }

    if (isBefore(eventData.toDateTime, eventData.fromDateTime)) {
      newErrors.toDateTime = "End date must be after start date"
    }

    // Ensure event duration is at least 30 minutes
    const durationInMinutes = (eventData.toDateTime.getTime() - eventData.fromDateTime.getTime()) / (1000 * 60)
    if (durationInMinutes < 30) {
      newErrors.toDateTime = "Event duration must be at least 30 minutes"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (field: string, value: string | number | Date | string[]) => {
    setEventData(prev => ({ ...prev, [field]: value }))
    // Clear error when field is updated
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handlePricingChange = (field: string, value: string | number) => {
    setCurrentPricing(prev => ({ ...prev, [field]: value }))
  }

  const addPricing = () => {
    if (!currentPricing.type.trim()) {
      toast({
        title: "Error",
        description: "Please enter a ticket type",
        variant: "destructive",
      })
      return
    }
    if (currentPricing.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      })
      return
    }
    if (currentPricing.numTicketsAvailable <= 0) {
      toast({
        title: "Error",
        description: "Number of tickets must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setEventData(prev => ({
      ...prev,
      pricing: [...prev.pricing, currentPricing]
    }))
    setCurrentPricing({
      type: "",
      price: 0,
      numTicketsAvailable: 0
    })
    toast({
      title: "Success",
      description: "Pricing tier added",
    })
  }

  const removePricing = (index: number) => {
    setEventData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }))
    toast({
      title: "Success",
      description: "Pricing tier removed",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please check all required fields and fix any errors",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (!organizationId) {
        throw new Error("Organization ID not found")
      }

      let response;
      if (mode === "create") {
        response = await fetch("https://api.ticketexpert.me/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...eventData,
            organizationId: organizationId,
          }),
        });
      } else if (mode === "edit") {
        response = await fetch(`https://api.ticketexpert.me/api/events/${event?.eventId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(eventData),
        });
      }

      if (!response?.ok) {
        const errorData = await response?.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Failed to ${mode} event: ${response?.status} ${response?.statusText}`
        );
      }

      const data = await response?.json()
      toast({
        title: "Success",
        description: "Event created successfully",
      })
      //onSuccess()
      router.push(`/home`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create event"
      console.error("Error creating event:", errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {/* Organization Details Section */}
        <div className="p-4 border rounded-lg bg-gray-50 space-y-4">
          <h3 className="font-semibold text-gray-900">Organization Details</h3>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Organization Name</p>
            <p className="text-lg font-semibold text-gray-900">{eventData.organiser}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Organization Description</p>
            <p className="text-gray-900">{eventData.orgDescription}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Organization Contact</p>
            <p className="text-gray-900">{eventData.orgContact}</p>
          </div>
        </div>

        {/* Event Details Section */}
        <div>
          <Label htmlFor="title" className="mb-2">Event Title *</Label>
          <Input
            id="title"
            value={eventData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className={errors.title ? "border-red-500" : ""}
            placeholder="Enter event title"
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label className="mb-2">Category *</Label>
          <Select value={eventData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show">Show</SelectItem>
              <SelectItem value="festival">Festival</SelectItem>
              <SelectItem value="workshop">Workshop</SelectItem>
              <SelectItem value="conference">Conference</SelectItem>
              <SelectItem value="exhibition">Exhibition</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <Label htmlFor="tags" className="mb-2">Tags (comma-separated) *</Label>
          <Input
            id="tags"
            value={eventData.tags.join(', ')}
            onChange={(e) => handleChange("tags", e.target.value.split(',').map(tag => tag.trim()))}
            className={errors.tags ? "border-red-500" : ""}
            placeholder="e.g., music, outdoor, entertainment"
          />
          {errors.tags && <p className="text-sm text-red-500 mt-1">{errors.tags}</p>}
        </div>

        <div>
          <Label htmlFor="image" className="mb-2">Image URL *</Label>
          <Input
            id="image"
            value={eventData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className={errors.image ? "border-red-500" : ""}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
        </div>

        <div>
          <Label htmlFor="description" className="mb-2">Description *</Label>
          <Textarea
            id="description"
            value={eventData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className={`${errors.description ? "border-red-500" : ""} h-32`}
            placeholder="Enter event description"
            rows={4}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2">Start Date & Time *</Label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full sm:w-auto justify-start text-left font-normal ${errors.fromDateTime ? "border-red-500" : ""}`}
                  >
                <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(eventData.fromDateTime, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                    selected={eventData.fromDateTime}
                    onSelect={(date) => {
                      if (date) {
                        // preserve time
                        const prev = eventData.fromDateTime
                        const newDate = new Date(date)
                        newDate.setHours(prev.getHours(), prev.getMinutes())
                        handleChange("fromDateTime", newDate)
                      }
                    }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
              <Input
                type="time"
                value={format(eventData.fromDateTime, "HH:mm")}
                onChange={e => {
                  const [h, m] = e.target.value.split(":").map(Number)
                  const newDate = new Date(eventData.fromDateTime)
                  newDate.setHours(h, m)
                  handleChange("fromDateTime", newDate)
                }}
                className="w-full sm:w-[160px] h-9 text-lg px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                aria-label="Start time"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2">End Date & Time *</Label>
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`w-full sm:w-auto justify-start text-left font-normal ${errors.toDateTime ? "border-red-500" : ""}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(eventData.toDateTime, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={eventData.toDateTime}
                    onSelect={(date) => {
                      if (date) {
                        // preserve time
                        const prev = eventData.toDateTime
                        const newDate = new Date(date)
                        newDate.setHours(prev.getHours(), prev.getMinutes())
                        handleChange("toDateTime", newDate)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(eventData.toDateTime, "HH:mm")}
                onChange={e => {
                  const [h, m] = e.target.value.split(":").map(Number)
                  const newDate = new Date(eventData.toDateTime)
                  newDate.setHours(h, m)
                  handleChange("toDateTime", newDate)
                }}
                className="w-full sm:w-[160px] h-9 text-lg px-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                aria-label="End time"
              />
            </div>
            {errors.toDateTime && <p className="text-sm text-red-500 mt-1">{errors.toDateTime}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="region" className="mb-2">Region *</Label>
          <Input
            id="region"
            value={eventData.region}
            onChange={(e) => handleChange("region", e.target.value)}
            className={errors.region ? "border-red-500" : ""}
            placeholder="e.g., Sydney, Melbourne"
          />
          {errors.region && <p className="text-sm text-red-500 mt-1">{errors.region}</p>}
        </div>

        <div>
          <Label htmlFor="venue" className="mb-2">Venue *</Label>
          <Input
            id="venue"
            value={eventData.venue}
            onChange={(e) => handleChange("venue", e.target.value)}
            className={errors.venue ? "border-red-500" : ""}
            placeholder="Enter venue name"
          />
          {errors.venue && <p className="text-sm text-red-500 mt-1">{errors.venue}</p>}
        </div>

        <div className="space-y-4">
          <Label className="mb-2">Pricing *</Label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Ticket Type"
              value={currentPricing.type}
              onChange={(e) => handlePricingChange("type", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={currentPricing.price}
              onChange={(e) => handlePricingChange("price", parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          <Input
            type="number"
              placeholder="Available Tickets"
              value={currentPricing.numTicketsAvailable}
              onChange={(e) => handlePricingChange("numTicketsAvailable", parseInt(e.target.value))}
              min="1"
            />
          </div>
          <Button onClick={addPricing} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Pricing
          </Button>

          {eventData.pricing.map((pricing, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="space-y-1">
                <p className="font-medium">{pricing.type}</p>
                <p className="text-sm text-gray-600">
                  ${pricing.price.toFixed(2)} - {pricing.numTicketsAvailable} tickets available
                </p>
              </div>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => removePricing(index)}
                className="hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {errors.pricing && <p className="text-sm text-red-500 mt-1">{errors.pricing}</p>}
        </div>

        <div>
          <Label htmlFor="refundPolicy" className="mb-2">Refund Policy *</Label>
          <Textarea
            id="refundPolicy"
            value={eventData.refundPolicy}
            onChange={(e) => handleChange("refundPolicy", e.target.value)}
            className={`${errors.refundPolicy ? "border-red-500" : ""} h-32`}
            placeholder="Enter refund policy details"
            rows={3}
          />
          {errors.refundPolicy && <p className="text-sm text-red-500 mt-1">{errors.refundPolicy}</p>}
        </div>

        <Button 
          className="w-full mt-4 bg-[#034AA6] hover:bg-[#023a8a] transition-colors" 
          onClick={handleSubmit}
          disabled={isLoading || !organization}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{mode === 'edit' ? 'Updating Event...' : 'Creating Event...'}</span>
            </div>
          ) : (
            mode === 'edit' ? 'Update Event' : 'Create Event'
          )}
        </Button>
      </div>
    </div>
  )
}