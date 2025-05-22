"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableData {
  date: string
  location: string
  event: string
  category: string
  sold: number
  gross: string
}

interface SalesTableProps {
  data: TableData[]
}

export function SalesTable({ data }: SalesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Category</TableHead>
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
              <TableCell className="capitalize">{item.category}</TableCell>
              <TableCell>{item.sold}</TableCell>
              <TableCell>{item.gross}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 