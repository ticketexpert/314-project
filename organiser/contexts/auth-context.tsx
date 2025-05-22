"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  token: string
  email: string
  name: string
}

interface Organization {
  id: string
  name: string
  description: string
}

interface AuthContextType {
  userId: string | null
  organizationId: string | null
  user: User | null
  organization: Organization | null
  setUserId: (id: string | null) => void
  setOrganizationId: (id: string | null) => void
  setUser: (user: User | null) => void
  setOrganization: (org: Organization | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)

  // Initialize state from localStorage only once on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedOrgId = localStorage.getItem('organizationId')
    const storedUser = localStorage.getItem('user')
    const storedOrg = localStorage.getItem('organization')
    
    if (storedUserId) setUserId(storedUserId)
    if (storedOrgId) setOrganizationId(storedOrgId)
    if (storedUser) setUser(JSON.parse(storedUser))
    if (storedOrg) setOrganization(JSON.parse(storedOrg))
  }, [])

  // Update localStorage when state changes
  useEffect(() => {
    if (userId) localStorage.setItem('userId', userId)
    else localStorage.removeItem('userId')
  }, [userId])

  useEffect(() => {
    if (organizationId) localStorage.setItem('organizationId', organizationId)
    else localStorage.removeItem('organizationId')
  }, [organizationId])

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user))
    else localStorage.removeItem('user')
  }, [user])

  useEffect(() => {
    if (organization) localStorage.setItem('organization', JSON.stringify(organization))
    else localStorage.removeItem('organization')
  }, [organization])

  const logout = () => {
    setUserId(null)
    setOrganizationId(null)
    setUser(null)
    setOrganization(null)
    localStorage.removeItem('userId')
    localStorage.removeItem('organizationId')
    localStorage.removeItem('user')
    localStorage.removeItem('organization')
  }

  return (
    <AuthContext.Provider value={{ 
      userId, 
      organizationId, 
      user,
      organization,
      setUserId, 
      setOrganizationId,
      setUser,
      setOrganization,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 