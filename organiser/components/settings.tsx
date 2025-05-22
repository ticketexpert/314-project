"use client"

import { useState, useEffect } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

function getPasswordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;
  return score;
}

function getStrengthLabel(score: number) {
  switch (score) {
    case 0: return { label: "Very Weak", color: "destructive" };
    case 1: return { label: "Weak", color: "orange" };
    case 2: return { label: "Fair", color: "yellow" };
    case 3: return { label: "Good", color: "blue" };
    case 4: return { label: "Strong", color: "green" };
    case 5: return { label: "Very Strong", color: "green" };
    default: return { label: "Very Weak", color: "destructive" };
  }
}

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [user, setUser] = useState<User | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          throw new Error("User ID not found")
        }

        const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUser(data)
        setEditForm({
          name: data.name,
          email: data.email,
        })
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load profile")
      } finally {
        setIsProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error("User ID not found")
      }

      const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: editForm.name,
          email: editForm.email,
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
      setIsEditing(false)
      toast.success("Profile updated successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (getPasswordStrength(newPassword) < 3) {
      toast.error("Password is too weak. Please use a stronger password.")
      return
    }

    setIsLoading(true)
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        throw new Error("User ID not found")
      }

      // First verify current password
      const verifyResponse = await fetch(`https://api.ticketexpert.me/api/users/auth?email=${encodeURIComponent(localStorage.getItem('email') || '')}&password=${encodeURIComponent(currentPassword)}`)
      
      if (!verifyResponse.ok) {
        throw new Error("Current password is incorrect")
      }

      // Update password
      const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: newPassword
        })
      })

      if (!response.ok) {
        throw new Error("Failed to update password")
      }

      toast.success("Password updated successfully")
      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = getPasswordStrength(newPassword)
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(passwordStrength)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">User Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {isProfileLoading ? (
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              ) : user ? (
                isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="mb-1">Name</Label>
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        required
                        className="h-14"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="mb-1">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        required
                        className="h-14"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="outline"
                        className="flex-1 h-[50px]"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 h-[50px] text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setIsEditing(false)
                          setEditForm({
                            name: user.name,
                            email: user.email,
                          })
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-6">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">{user.name}</p>
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-sm text-muted-foreground capitalize">Role: {user.role}</p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => setIsEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <p className="text-red-500">Failed to load profile</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <Label htmlFor="current-password" className="mb-1">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="h-14"
                  />
                </div>
                <div>
                  <Label htmlFor="new-password" className="mb-1">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-14"
                  />
                </div>

                {newPassword && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Password Strength:</span>
                      <span className={`text-sm font-bold text-${strengthColor}`}>
                        {strengthLabel}
                      </span>
                    </div>
                    <Progress value={(passwordStrength / 5) * 100} className="h-2.5" />
                  </div>
                )}

                <div>
                  <Label htmlFor="confirm-password" className="mb-1">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-14"
                  />
                </div>

                {/* Password Requirements */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${newPassword.length >= 8 ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>At least one uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${/[0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>At least one number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`w-4 h-4 ${/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-500' : 'text-gray-300'}`} />
                    <span>At least one special character</span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="outline"
                  className="mt-2 w-full h-[50px]"
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}