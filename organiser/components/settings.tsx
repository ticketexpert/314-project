"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Settings() {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="mb-1">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password" className="mb-1">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <Button className="mt-2">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  )
}