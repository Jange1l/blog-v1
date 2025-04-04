'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  username: string
  email: string
  highestScore: number
}

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateScore: (score: number) => Promise<boolean>
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateScore: async () => false,
})

// Hook to use the auth context
export const useAuth = () => useContext(AuthContext)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)

        const response = await fetch('/api/auth/me')

        if (!response.ok) {
          // If not authenticated, that's not an error - just no user
          if (response.status === 401) {
            setUser(null)
            return
          }

          throw new Error('Failed to fetch user')
        }

        const data = await response.json()
        setUser(data.user)
      } catch (error) {
        console.error('Error fetching user:', error)
        setError('Failed to authenticate')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      setUser(data.user)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      setUser(data.user)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setLoading(true)

      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      setError(error instanceof Error ? error.message : 'Logout failed')
    } finally {
      setLoading(false)
    }
  }

  // Update score function
  const updateScore = async (score: number): Promise<boolean> => {
    try {
      if (!user) return false

      const response = await fetch('/api/scores/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ score }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update score')
      }

      // Update local user state with the new high score if applicable
      if (data.highestScore > (user.highestScore || 0)) {
        setUser({
          ...user,
          highestScore: data.highestScore,
        })
        return true // New high score
      }

      return false // Not a new high score
    } catch (error) {
      console.error('Update score error:', error)
      return false
    }
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateScore,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
