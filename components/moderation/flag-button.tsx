"use client"

import { useState } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FlagDialog } from "@/components/moderation/flag-dialog"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/hooks/use-toast"

interface FlagButtonProps {
  contentId: string
  contentType: "question" | "answer" | "comment"
}

export function FlagButton({ contentId, contentType }: FlagButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleFlagClick = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to flag content.",
        variant: "destructive",
      })
      return
    }
    setIsDialogOpen(true)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive"
        onClick={handleFlagClick}
      >
        <Flag className="h-4 w-4 mr-1" />
        <span className="sr-only md:not-sr-only md:inline">Flag</span>
      </Button>
      <FlagDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} contentId={contentId} contentType={contentType} />
    </>
  )
}
