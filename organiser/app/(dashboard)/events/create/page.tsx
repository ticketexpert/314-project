"use client"

import { EventForm } from "@/components/event-form"

export default function CreateEventPage() {
    return (
        <div className="max-w-2xl p-6">
            <h1 className="text-4xl mb-4 font-bold text-[#034AA6]">Create Event</h1>
            <EventForm />
        </div>
    )
}