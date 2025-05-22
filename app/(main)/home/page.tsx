"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionList } from "@/components/question-list"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient && !loading && !user) {
      router.push("/")
    }
  }, [isClient, loading, user, router])

  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    // This will be briefly shown before the redirect happens
    return null
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Top Questions</h1>
            <Button asChild>
              <Link href="/ask">Ask Question</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Button variant="secondary" size="sm" className="rounded-full">
              Newest
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Active
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Unanswered
            </Button>
          </div>
          <QuestionList />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
