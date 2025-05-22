"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LandingPage } from "@/components/landing-page"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && user) {
      router.push("/home")
    }
  }, [isClient, loading, user, router])

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (user) {
    // This will be briefly shown before the redirect happens
    return null
  }

  return <LandingPage />
}
