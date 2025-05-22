"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsCheckingRole(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          setIsAdmin(userData.role === "admin")
        }
      } catch (error: any) {
        console.error("Error checking admin status:", error)
        setError("Unable to verify admin status. Please try again later.")
      } finally {
        setIsCheckingRole(false)
      }
    }

    if (!loading) {
      checkAdminStatus()
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
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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

  if (!isAdmin) {
    return (
      <div className="container py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only administrators can access the admin dashboard.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}
