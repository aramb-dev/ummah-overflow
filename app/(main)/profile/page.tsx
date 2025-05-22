"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function ProfileRedirectPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to the user's profile page
        router.push(`/${user.displayName || user.uid}`)
      } else {
        // If not logged in, redirect to login
        router.push("/login?redirect=/profile")
      }
    }
  }, [user, loading, router])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2">Redirecting to your profile...</span>
    </div>
  )
}
