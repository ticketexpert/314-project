"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function NotificationSettings() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Product Updates</span>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span>Newsletters</span>
            <Switch />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}