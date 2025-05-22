"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LayoutDashboard } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { User } from "@/lib/types"

export function AdminNavItem() {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data() as User
          setIsAdmin(userData.role === "admin")
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  if (loading || !isAdmin) {
    return null
  }

  return (
    <Link
      href="/admin"
      className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60"
    >
      <LayoutDashboard className="h-4 w-4" />
      <span>Admin</span>
    </Link>
  )
}
