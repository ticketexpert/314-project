import { DataTable } from "@/components/data-table"


export default function EventsPage() {
    return (
        <div className="w-full px-4 py-10 space-y-10">
            <h1 className="text-4xl font-bold text-[#034AA6]">Events</h1>
            <DataTable />
        </div>
    )
}