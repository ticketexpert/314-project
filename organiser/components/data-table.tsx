import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Event = {
  date: string
  location: string
  event: string
  status: string
  sold: number
  gross: string
}

export function DataTable({ data }: { data: Event[] }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sold</TableHead>
            <TableHead>Gross</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.location}</TableCell>
              <TableCell>{item.event}</TableCell>
              <TableCell>{item.status}</TableCell>
              <TableCell>{item.sold}</TableCell>
              <TableCell>{item.gross}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}