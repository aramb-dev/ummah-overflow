"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import type { FlagReason, FlagContentType } from "@/lib/types"

interface FlagDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contentId: string
  contentType: FlagContentType
}

const flagReasons: { value: FlagReason; label: string; description: string }[] = [
  {
    value: "spam",
    label: "Spam",
    description: "This content is an advertisement, or vandalism",
  },
  {
    value: "rude_or_abusive",
    label: "Rude or abusive",
    description: "This content contains offensive language or personal attacks",
  },
  {
    value: "low_quality",
    label: "Very low quality",
    description: "This content is not salvageable through editing",
  },
  {
    value: "off_topic",
    label: "Off-topic",
    description: "This content is not relevant to the Ummah.dev community",
  },
  {
    value: "needs_improvement",
    label: "Needs improvement",
    description: "This content needs significant editing or clarification",
  },
  {
    value: "plagiarism",
    label: "Plagiarism",
    description: "This content is copied from elsewhere without proper attribution",
  },
  {
    value: "other",
    label: "Other",
    description: "This content needs moderator attention for another reason",
  },
]

export function FlagDialog({ open, onOpenChange, contentId, contentType }: FlagDialogProps) {
  const [reason, setReason] = useState<FlagReason | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        description: "You must select a reason for flagging this content.",
        variant: "destructive",
      })
      return
    }

    if (reason === "other" && !description.trim()) {
      toast({
        title: "Please provide details",
        description: "You must provide details when selecting 'Other' as the reason.",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to flag content.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Add the flag to Firestore
      await addDoc(collection(db, "flags"), {
        contentId,
        contentType,
        reason,
        description: description.trim() || undefined,
        reporterId: user.uid,
        status: "pending",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      toast({
        title: "Content flagged",
        description: "Thank you for helping keep Ummah.dev a respectful community.",
      })

      // Close the dialog and reset form
      onOpenChange(false)
      setReason(null)
      setDescription("")

      // Refresh the page to update UI if needed
      router.refresh()
    } catch (error) {
      console.error("Error flagging content:", error)
      toast({
        title: "Failed to flag content",
        description: "An error occurred while flagging the content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Flag inappropriate content</DialogTitle>
          <DialogDescription>
            Please select a reason for flagging this content. Flagged content will be reviewed by moderators.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={reason || ""} onValueChange={(value) => setReason(value as FlagReason)}>
            {flagReasons.map((flagReason) => (
              <div key={flagReason.value} className="flex items-start space-x-2 mb-3">
                <RadioGroupItem value={flagReason.value} id={flagReason.value} />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor={flagReason.value} className="font-medium">
                    {flagReason.label}
                  </Label>
                  <p className="text-sm text-muted-foreground">{flagReason.description}</p>
                </div>
              </div>
            ))}
          </RadioGroup>
          {reason === "other" && (
            <div className="mt-4">
              <Label htmlFor="description">Please provide details:</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain why this content should be reviewed by moderators..."
                className="mt-1.5"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Flag"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
