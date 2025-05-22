"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"

export function ModerationNavItem() {
  const { user } = useAuth()
  const [isModerator, setIsModerator] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkModeratorStatus = async () => {
      if (!user) {
        setIsModerator(false)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          setIsModerator(userData.role === "moderator" || userData.role === "admin")
        } else {
          setIsModerator(false)
        }
      } catch (error) {
        console.error("Error checking moderator status:", error)
        // Don't show the error to the user, just assume they're not a moderator
        setIsModerator(false)
      } finally {
        setLoading(false)
      }
    }

    checkModeratorStatus()
  }, [user])

  if (loading || !isModerator) {
    return null
  }

  return (
    <Link
      href="/moderation"
      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
    >
      <Shield className="h-4 w-4" />
      <span>Moderation</span>
    </Link>
  )
}
