"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BillingInfo() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Billing</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">You have 1 saved card.</p>
          <Button className="mt-4">Manage Billing</Button>
        </CardContent>
      </Card>
    </div>
  )
}