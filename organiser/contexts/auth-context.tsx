"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import Cookies from 'js-cookie'

interface User {
  userId: number;
  name: string;
  email: string;
  token: string;
  role: string;
  avatar?: string;
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
  isInitialized: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize state from both localStorage and cookies
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Try to get from cookies first
        const cookieUserId = Cookies.get('userId')
        const cookieOrgId = Cookies.get('organizationId')
        const cookieToken = Cookies.get('token')
        const cookieUserRole = Cookies.get('userRole')

        // Fallback to localStorage if cookies are not available
        const storedUserId = localStorage.getItem('userId')
        const storedOrgId = localStorage.getItem('organizationId')
        const storedUser = localStorage.getItem('user')
        const storedOrg = localStorage.getItem('organization')

        // Use cookie values if available, otherwise use localStorage
        const finalUserId = cookieUserId || storedUserId
        const finalOrgId = cookieOrgId || storedOrgId

        if (finalUserId) {
          setUserId(finalUserId)
          // If we have a token but no user data, fetch user data
          if (cookieToken && !storedUser) {
            fetch(`https://api.ticketexpert.me/api/users/${finalUserId}`)
              .then(res => res.json())
              .then(userData => {
                setUser({
                  userId: userData.userId,
                  name: userData.name,
                  email: userData.email,
                  token: cookieToken,
                  role: userData.role,
                  avatar: userData.avatar
                })
              })
              .catch(console.error)
          } else if (storedUser) {
            setUser(JSON.parse(storedUser))
          }
        }

        if (finalOrgId) {
          setOrganizationId(finalOrgId)
          if (storedOrg) {
            setOrganization(JSON.parse(storedOrg))
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeAuth()
  }, [])

  // Update both localStorage and cookies when state changes
  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId)
      Cookies.set('userId', userId, { expires: 7 })
    } else {
      localStorage.removeItem('userId')
      Cookies.remove('userId')
    }
  }, [userId])

  useEffect(() => {
    if (organizationId) {
      localStorage.setItem('organizationId', organizationId)
      Cookies.set('organizationId', organizationId, { expires: 7 })
    } else {
      localStorage.removeItem('organizationId')
      Cookies.remove('organizationId')
    }
  }, [organizationId])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
      Cookies.set('token', user.token, { expires: 7 })
    } else {
      localStorage.removeItem('user')
      Cookies.remove('token')
    }
  }, [user])

  useEffect(() => {
    if (organization) {
      localStorage.setItem('organization', JSON.stringify(organization))
    } else {
      localStorage.removeItem('organization')
    }
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
    Cookies.remove('userId')
    Cookies.remove('organizationId')
    Cookies.remove('token')
    Cookies.remove('userRole')
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
      logout,
      isInitialized
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