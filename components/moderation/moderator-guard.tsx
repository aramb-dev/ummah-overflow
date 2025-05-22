"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function ModeratorGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [isModerator, setIsModerator] = useState(false)
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkModeratorStatus = async () => {
      if (!user) {
        setIsCheckingRole(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          setIsModerator(userData.role === "moderator" || userData.role === "admin")
        }
      } catch (error: any) {
        console.error("Error checking moderator status:", error)
        setError("Unable to verify moderator status. Please try again later.")
      } finally {
        setIsCheckingRole(false)
      }
    }

    if (!loading) {
      checkModeratorStatus()
    }
  }, [user, loading])

  useEffect(() => {
    if (!loading && !isCheckingRole && !user) {
      router.push("/login")
    }
  }, [user, loading, isCheckingRole, router])

  if (loading || isCheckingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!isModerator) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
