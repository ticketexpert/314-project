"use client"

import { useState, useEffect } from 'react'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
      const userId = localStorage.getItem('userId')
      const userRole = localStorage.getItem('userRole')
      
      setIsAuthenticated(isLoggedIn && !!userId && userRole === 'Organiser')
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  return {
    isAuthenticated,
    isLoading
  }
} 