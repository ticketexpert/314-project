"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

export function EventForm() {
  const [eventData, setEventData] = useState({
    date: new Date(),
    location: "",
    event: "",
    status: "Upcoming",
    sold: "",
    gross: ""
  })

  const handleChange = (field: string, value: string | number | Date) => {
    setEventData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    console.log("Event Created:", eventData)
    alert("Event created successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label className="mb-2">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(eventData.date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={eventData.date}
                onSelect={(date) => date && handleChange("date", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="location" className="mb-2">Location</Label>
          <Input
            id="location"
            value={eventData.location}
            onChange={(e) => handleChange("location", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="event" className="mb-2">Event Name</Label>
          <Input
            id="event"
            value={eventData.event}
            onChange={(e) => handleChange("event", e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-2">Status</Label>
          <Select value={eventData.status} onValueChange={(value) => handleChange("status", value)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sold" className="mb-2">Tickets Sold</Label>
          <Input
            id="sold"
            type="number"
            value={eventData.sold}
            onChange={(e) => handleChange("sold", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="gross" className="mb-2">Gross ($)</Label>
          <Input
            id="gross"
            type="text"
            value={eventData.gross}
            onChange={(e) => handleChange("gross", e.target.value)}
          />
        </div>

        <Button className="w-full mt-4 bg-[#034AA6]" onClick={handleSubmit}>
          Create Event
        </Button>
      </div>
    </div>
  )
}