"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = () => {
    // Clear auth state using context
    logout()
    
    // Redirect to login page
    router.push("/login")
  }

  return (
    <Button 
      variant="ghost" 
      onClick={handleLogout}
      className="flex items-center gap-2"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
} 