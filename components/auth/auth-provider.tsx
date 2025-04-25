"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: Error | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          throw error
        }

        setSession(session)
        setUser(session?.user ?? null)
      } catch (err) {
        console.error("Auth session error:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
        setSession(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }

      try {
        const {
          data: { subscription },
        } = await supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setIsLoading(false)
        })

        return () => subscription.unsubscribe()
      } catch (err) {
        console.error("Auth subscription error:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      }
    }

    getSession()
  }, [supabase])

  return <AuthContext.Provider value={{ user, session, isLoading, error }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
