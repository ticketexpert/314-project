"use client"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default function ProfileInfo() {
  return (
    <Card className="w-full">
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
  )
}