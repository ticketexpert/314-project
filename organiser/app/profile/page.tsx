"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ProfilePage() {
  return (
    <div className="max-w-4xl px-4 py-10 space-y-10">
      
      <h1 className="text-4xl font-bold text-[#034AA6]">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Profile Info</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/avatar.png" alt="Profile" />
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="font-semibold text-lg">Matthew Gale</p>
            <p className="text-muted-foreground">matthew.gale@example.com</p>
            <Button variant="outline" className="mt-2">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Billing</h2>
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You have 1 saved card.</p>
            <Button className="mt-4">Manage Billing</Button>
          </CardContent>
        </Card>
      </div>

      {/* Notifications Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
        <Card>
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

      {/* Settings Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Settings</h2>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <Button className="mt-2">Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}