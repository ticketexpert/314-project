"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, Settings, User } from "lucide-react"

interface NavUserProps {
  userData: {
    name: string;
    email: string;
    avatar: string;
  };
  isLoading: boolean;
}

export function NavUser({ userData, isLoading }: NavUserProps) {
  const router = useRouter()
  const { user, setUser, setUserId, setOrganizationId } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return "U"
    const parts = name.split(" ")
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      // Clear auth context
      setUser(null)
      setUserId(null)
      setOrganizationId(null)
      
      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (!user) {
    return (
      <Button
        variant="ghost"
        className="w-full justify-start gap-2 hover:bg-white/10"
        onClick={() => router.push("/login")}
      >
        <Avatar className="h-6 w-6">
          <AvatarFallback className="bg-primary/10 text-primary">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <span className="font-medium">Sign In</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-9 w-9 rounded-full hover:bg-white/10 transition-colors"
          disabled={isLoading}
        >
          <Avatar className="h-9 w-9 border-2 border-white/10">
            <AvatarImage 
              src={userData.avatar} 
              alt={userData.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary">
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                getInitials(userData.name || "")
              )}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {isLoading ? (
                <div className="h-4 w-32 animate-pulse rounded bg-primary/10" />
              ) : (
                userData.name || "User"
              )}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {isLoading ? (
                <div className="mt-1 h-3 w-40 animate-pulse rounded bg-primary/10" />
              ) : (
                userData.email || "No email provided"
              )}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/settings/user" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="cursor-pointer">
          <Link href="/profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 focus:text-red-600 cursor-pointer"
          onClick={handleLogout}
          disabled={isLoggingOut || isLoading}
        >
          <div className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
