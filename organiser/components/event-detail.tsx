"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, DollarSign, Users, Share2, Edit2, Ticket, Eye, Download, Printer, MoreVertical, Trash2, CheckCircle2, XCircle, RefreshCcw, Loader2, FileText } from "lucide-react"
import { format } from "date-fns"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeSVG } from 'qrcode.react'  
import { useAuth } from "@/contexts/auth-context"
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useToast } from "@/components/ui/use-toast"

interface Ticket {
  ticketId: string;
  eventId: number;
  userId: number;
  locationDetails: {
    section: string;
    row: string;
    seat: string;
  };
  ticketStatus: string;
  ticketType: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
}

interface Event {
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
  createdAt: string;
  updatedAt: string;
}

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

interface EventDetailProps {
  onEditEvent: () => void;
}

export function EventDetail({ onEditEvent }: EventDetailProps) {
  const params = useParams()
  const { user, organization: authOrganization } = useAuth()
  const { toast } = useToast()
  const [event, setEvent] = useState<Event | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; ticket: Ticket | null }>({
    open: false,
    ticket: null
  })
  const [statusMenu, setStatusMenu] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventAndOrganization = async () => {
      try {
        // Fetch event details
        const eventResponse = await fetch(`https://api.ticketexpert.me/api/events/${params.eventId}`)
        if (!eventResponse.ok) {
          throw new Error("Failed to fetch event")
        }
        const eventData = await eventResponse.json()
        setEvent(eventData)

        // Fetch organization details using eventOrgId
        if (eventData.eventOrgId) {
          const orgResponse = await fetch(`https://api.ticketexpert.me/api/organisations/${eventData.eventOrgId}`)
          if (!orgResponse.ok) {
            throw new Error("Failed to fetch organization")
          }
          const orgData = await orgResponse.json()
          setOrganization(orgData)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
        toast({
          title: "Error",
          description: "Failed to load event details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("https://api.ticketexpert.me/api/tickets", {
          headers: {
            "Authorization": `Bearer ${user?.token}`
          }
        })
        if (!response.ok) {
          throw new Error("Failed to fetch tickets")
        }
        const data = await response.json()
        // Filter tickets for this event
        const eventTickets = data.filter((ticket: Ticket) => ticket.eventId === Number(params.eventId))
        setTickets(eventTickets)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch tickets")
      }
    }

    fetchEventAndOrganization()
    fetchTickets()
  }, [params.eventId, user?.token, toast])

  const handleDeleteTicket = async (ticketId: string) => {
    if (!ticketId) return
    
    setActionLoading(ticketId)
    try {
      const res = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user?.token}`
        }
      })
      if (!res.ok) throw new Error('Failed to delete ticket')
      setTickets(tickets => tickets.filter(t => t.ticketId !== ticketId))
      setConfirmDelete({ open: false, ticket: null })
    } catch (error) {
      console.error('Error deleting ticket:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({ ticketStatus: newStatus })
      })

      if (!response.ok) {
        throw new Error("Failed to update ticket status")
      }

      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.ticketId === ticketId 
          ? { ...ticket, ticketStatus: newStatus }
          : ticket
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ticket status")
    }
  }

  const handleApproveRefund = async (ticketId: string) => {
    try {
      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        }
      })

      if (!response.ok) {
        throw new Error("Failed to approve refund")
      }

      // Update local state
      setTickets(tickets.map(ticket => 
        ticket.ticketId === ticketId 
          ? { ...ticket, ticketStatus: "REFUNDED" }
          : ticket
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve refund")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    })
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsModalOpen(true)
  }

  const handleDownloadTicket = (ticket: Ticket) => {
    // Create CSV content for single ticket
    const headers = [
      'Ticket ID',
      'Order Number',
      'Ticket Type',
      'Status',
      'Section',
      'Row',
      'Seat',
      'Purchase Date'
    ]

    const csvContent = [
      headers.join(','),
      [
        ticket.ticketId,
        ticket.orderNumber,
        ticket.ticketType,
        ticket.ticketStatus,
        ticket.locationDetails.section,
        ticket.locationDetails.row,
        ticket.locationDetails.seat,
        formatDate(ticket.createdAt)
      ].join(',')
    ].join('\n')

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `ticket-${ticket.ticketId}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handlePrintTicket = (ticket: Ticket) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print tickets')
      return
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ticket - ${event?.title || 'Event Ticket'}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Rethink+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Rethink Sans', sans-serif;
              margin: 20px;
              padding: 0;
              background: #f8fafc;
            }
            .ticket {
              border: 2px solid #D12026;
              padding: 30px;
              max-width: 800px;
              margin: 0 auto;
              background: #ecfdf5;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(97deg, #F99B1C -1.26%, #D12026 68.5%);
              color: white;
              padding: 30px;
              text-align: center;
              margin: -30px -30px 30px -30px;
              border-radius: 14px 14px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .header p {
              margin: 10px 0 0;
              font-size: 18px;
              opacity: 0.9;
            }
            .ticket-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin-bottom: 30px;
            }
            .info-section {
              background: rgba(22,101,52,0.05);
              padding: 20px;
              border-radius: 12px;
            }
            .info-section h3 {
              margin: 0 0 15px;
              color: #166534;
              font-size: 18px;
              font-weight: 600;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 12px;
              font-size: 15px;
            }
            .info-label {
              color: #4b5563;
            }
            .info-value {
              font-weight: 500;
              color: #166534;
            }
            .qr-code {
              text-align: center;
              margin: 30px 0;
            }
            .qr-code img {
              max-width: 200px;
              padding: 15px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            .qr-code p {
              margin-top: 10px;
              color: #4b5563;
              font-size: 14px;
            }
            .purchase-date {
              text-align: center;
              margin-top: 20px;
              font-size: 14px;
              color: #6b7280;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
                background: white;
              }
              .ticket {
                box-shadow: none;
                border: 2px solid #D12026;
              }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>${event?.title || 'Event Ticket'}</h1>
              <p>${event?.venue || 'Venue'}</p>
            </div>
            <div class="ticket-info">
              <div class="info-section">
                <h3>Ticket Information</h3>
                <div class="info-row">
                  <span class="info-label">Ticket ID</span>
                  <span class="info-value">${ticket.ticketId}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Order Number</span>
                  <span class="info-value">${ticket.orderNumber}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Ticket Type</span>
                  <span class="info-value">${ticket.ticketType}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Status</span>
                  <span class="info-value">${ticket.ticketStatus}</span>
                </div>
              </div>
              <div class="info-section">
                <h3>Location Details</h3>
                <div class="info-row">
                  <span class="info-label">Section</span>
                  <span class="info-value">${ticket.locationDetails.section}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Row</span>
                  <span class="info-value">${ticket.locationDetails.row}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Seat</span>
                  <span class="info-value">${ticket.locationDetails.seat}</span>
                </div>
              </div>
            </div>
            <div class="qr-code">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticket.ticketId}" alt="QR Code" />
              <p>Scan at entry</p>
            </div>
            <div class="purchase-date">
              Purchase Date: ${formatDate(ticket.createdAt)}
            </div>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      printWindow.close()
    }
  }

  const handleExportCSV = () => {
    // Create CSV content
    const headers = [
      'Ticket ID',
      'Order Number',
      'Ticket Type',
      'Status',
      'Section',
      'Row',
      'Seat',
      'Purchase Date'
    ]

    const csvContent = [
      headers.join(','),
      ...tickets.map(ticket => [
        ticket.ticketId,
        ticket.orderNumber,
        ticket.ticketType,
        ticket.ticketStatus,
        ticket.locationDetails.section,
        ticket.locationDetails.row,
        ticket.locationDetails.seat,
        formatDate(ticket.createdAt)
      ].join(','))
    ].join('\n')

    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${event?.title}-tickets.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Event link has been copied to clipboard",
      })
    }
  }

  const handleChangeStatus = async (ticketId: string, newStatus: string) => {
    setActionLoading(ticketId)
    try {
      // Map UI status to API status
      const statusMap: { [key: string]: string } = {
        'VALID': 'active',
        'USED': 'scanned',
        'CANCELLED': 'cancelled',
        'REFUNDED': 'refunded',
        'REFUND_REQUEST': 'refund_request'
      }

      const apiStatus = statusMap[newStatus] || newStatus.toLowerCase()

      // Get the ticket to find its userId
      const ticket = tickets.find(t => t.ticketId === ticketId)
      if (!ticket) {
        throw new Error('Ticket not found')
      }

      const response = await fetch(`https://api.ticketexpert.me/api/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          userId: ticket.userId, // Use the ticket's userId instead of the current user's
          status: apiStatus 
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to update ticket status')
      }

      // Update local state
      setTickets(tickets.map(t => 
        t.ticketId === ticketId 
          ? { ...t, ticketStatus: apiStatus }
          : t
      ))
      setStatusMenu(null)
      
      toast({
        title: "Success",
        description: "Ticket status updated successfully",
      })
    } catch (error) {
      console.error('Error updating ticket status:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update ticket status",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Update the status menu options
  const getStatusOptions = (currentStatus: string) => {
    const options = [
      { value: 'VALID', label: 'Mark as Active', disabled: currentStatus === 'active' },
      { value: 'USED', label: 'Mark as Scanned', disabled: currentStatus === 'scanned' },
      { value: 'CANCELLED', label: 'Mark as Cancelled', disabled: currentStatus === 'cancelled' },
      { value: 'REFUNDED', label: 'Mark as Refunded', disabled: currentStatus === 'refunded' }
    ]
    return options.filter(option => !option.disabled)
  }

  const handleGenerateReport = () => {
    if (!event) return

    // Create new PDF document
    const doc = new jsPDF()
    
    // Add title
    doc.setFontSize(20)
    doc.text('Event Report', 14, 20)
    
    // Add event details
    doc.setFontSize(12)
    doc.text(`Event: ${event.title}`, 14, 35)
    doc.text(`Category: ${event.category}`, 14, 45)
    doc.text(`Date: ${formatDate(event.fromDateTime)} - ${formatDate(event.toDateTime)}`, 14, 55)
    doc.text(`Venue: ${event.venue}, ${event.region}`, 14, 65)
    
    // Add ticket sales summary
    doc.setFontSize(16)
    doc.text('Ticket Sales Summary', 14, 85)
    
    // Calculate ticket statistics
    const totalTickets = tickets.length
    const statusCounts = tickets.reduce((acc, ticket) => {
      acc[ticket.ticketStatus] = (acc[ticket.ticketStatus] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Add ticket statistics
    doc.setFontSize(12)
    doc.text(`Total Tickets: ${totalTickets}`, 14, 95)
    Object.entries(statusCounts).forEach(([status, count], index) => {
      doc.text(`${status}: ${count}`, 14, 105 + (index * 10))
    })
    
    // Add ticket details table
    doc.setFontSize(16)
    doc.text('Ticket Details', 14, 145)
    
    // Prepare table data
    const tableData = tickets.map(ticket => [
      ticket.ticketId,
      ticket.orderNumber,
      ticket.ticketType,
      ticket.ticketStatus,
      `${ticket.locationDetails.section} - Row ${ticket.locationDetails.row}, Seat ${ticket.locationDetails.seat}`,
      formatDate(ticket.createdAt)
    ])
    
    // Add table using autoTable
    autoTable(doc, {
      startY: 155,
      head: [['Ticket ID', 'Order #', 'Type', 'Status', 'Location', 'Purchase Date']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 74, 173] }, // #004AAD
      styles: { fontSize: 8 }
    })
    
    // Add footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(10)
      doc.text(
        `Generated on ${formatDate(new Date().toISOString())}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      )
    }
    
    // Save the PDF
    doc.save(`${event.title}-report.pdf`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">{error || "Event not found"}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Event Header */}
      <div className="relative rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none">
            {event.category}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.fromDateTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}, {event.region}</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Event Details</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Event */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#004AAD] mb-4">About This Event</h2>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>

              {/* Event Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-[#004AAD] mb-4">Event Details</h2>
                  <div className="space-y-6">
                    {/* Date and Time */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-5 w-5 text-[#004AAD]" />
                        <h3 className="font-semibold">Date & Time</h3>
                      </div>
                      <p className="text-gray-600">
                        {formatDate(event.fromDateTime)} - {formatDate(event.toDateTime)}
                      </p>
                    </div>

                    {/* Location */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-[#004AAD]" />
                        <h3 className="font-semibold">Location</h3>
                      </div>
                      <p className="text-gray-600">{event.venue}, {event.region}</p>
                    </div>

                    {/* Pricing */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-5 w-5 text-[#004AAD]" />
                        <h3 className="font-semibold">Pricing</h3>
                      </div>
                      <div className="space-y-2">
                        {event.pricing.map((price, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{price.type}</p>
                              <p className="text-sm text-gray-500">
                                {price.numTicketsAvailable} tickets available
                              </p>
                            </div>
                            <p className="text-lg font-bold text-[#004AAD]">
                              ${price.price.toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-gray-600">
                        <span className="font-semibold">Refund Policy:</span> {event.refundPolicy}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Organization Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-[#004AAD]" />
                    <h2 className="text-xl font-bold text-[#004AAD]">Organization</h2>
                  </div>
                  {organization ? (
                    <>
                      <h3 className="text-lg font-bold mb-2">{organization.name}</h3>
                      <p className="text-gray-600 mb-4">{organization.description}</p>
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-[#004AAD] hover:bg-[#003d8f]"
                          onClick={onEditEvent}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit Event
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={handleShareEvent}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Event
                        </Button>
                      </div>
                      <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-600 mb-1">
                          Contact Information
                        </p>
                        <p className="text-sm text-gray-600">{organization.contact}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-600">Organization information not available</p>
                  )}
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[#004AAD] mb-4">Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 hover:bg-gray-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#004AAD]">Ticket Sales</h2>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleExportCSV}
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleGenerateReport}
                  >
                    <FileText className="h-4 w-4" />
                    Generate Report
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.ticketId}>
                      <TableCell>#{ticket.ticketId}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">Order #{ticket.orderNumber}</p>
                          <p className="text-sm text-gray-500">
                            {ticket.locationDetails.section} - Row {ticket.locationDetails.row}, Seat {ticket.locationDetails.seat}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.ticketType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            ticket.ticketStatus === 'active'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {ticket.ticketStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(ticket.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2 items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadTicket(ticket)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setStatusMenu(ticket.ticketId)}
                            disabled={actionLoading === ticket.ticketId}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setConfirmDelete({ open: true, ticket })}
                            disabled={actionLoading === ticket.ticketId}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {ticket.ticketStatus === 'refund_request' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleApproveRefund(ticket.ticketId)}
                              disabled={actionLoading === ticket.ticketId}
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Approve Refund
                            </Button>
                          )}
                        </div>
                        {/* Status menu dropdown */}
                        {statusMenu === ticket.ticketId && (
                          <div className="absolute z-50 bg-white border rounded shadow p-2 mt-2">
                            {getStatusOptions(ticket.ticketStatus).map(option => (
                              <button
                                key={option.value}
                                className="block w-full text-left px-2 py-1 hover:bg-gray-100"
                                onClick={() => handleChangeStatus(ticket.ticketId, option.value)}
                                disabled={actionLoading === ticket.ticketId}
                              >
                                {actionLoading === ticket.ticketId ? (
                                  <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                    Updating...
                                  </div>
                                ) : (
                                  option.label
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Information Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ticket Information</DialogTitle>
            <DialogDescription>
              Detailed information about the selected ticket
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket ID</p>
                  <p className="font-medium">#{selectedTicket.ticketId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <Badge
                    variant={
                      selectedTicket.ticketStatus === 'active'
                        ? 'default'
                        : 'destructive'
                    }
                  >
                    {selectedTicket.ticketStatus}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Order Details</p>
                <p className="font-medium">Order #{selectedTicket.orderNumber}</p>
                <p className="text-sm text-gray-500">
                  {selectedTicket.locationDetails.section} - Row {selectedTicket.locationDetails.row}, Seat {selectedTicket.locationDetails.seat}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ticket Details</p>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium">{selectedTicket.ticketType}</p>
                  <p className="text-sm text-gray-500">
                    Purchased on {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePrintTicket(selectedTicket)}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadTicket(selectedTicket)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete.open} onOpenChange={(open) => {
        if (!open) setConfirmDelete({ open: false, ticket: null })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setConfirmDelete({ open: false, ticket: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => confirmDelete.ticket && handleDeleteTicket(confirmDelete.ticket.ticketId)}
              disabled={actionLoading === confirmDelete.ticket?.ticketId}
            >
              {actionLoading === confirmDelete.ticket?.ticketId ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </div>
              ) : (
                'Delete'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Menu */}
      {statusMenu && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {getStatusOptions(tickets.find(t => t.ticketId === statusMenu)?.ticketStatus || '').map(option => (
              <button
                key={option.value}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => handleChangeStatus(statusMenu, option.value)}
                disabled={actionLoading === statusMenu}
              >
                {actionLoading === statusMenu ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Updating...
                  </div>
                ) : (
                  option.label
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 