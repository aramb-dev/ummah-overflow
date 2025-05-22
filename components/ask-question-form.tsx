"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function AskQuestionForm() {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()
  const router = useRouter()

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim() || !body.trim() || tags.length === 0) {
      setError("Please fill in all required fields and add at least one tag.")
      return
    }

    setIsSubmitting(true)

    try {
      // Add the question to Firestore
      const questionRef = await addDoc(collection(db, "questions"), {
        title,
        body,
        tags,
        authorId: user?.uid,
        isAnonymous,
        votes: 0,
        answersCount: 0,
        views: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Redirect to the question page
      router.push(`/questions/${questionRef.id}`)
    } catch (error) {
      console.error("Error adding question:", error)
      setError("Failed to submit your question. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Ask a Question</h1>
      <div className="bg-muted/30 p-4 rounded-lg mb-6">
        <h2 className="font-medium mb-2">Writing a good question</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
          <li>Summarize your problem in a one-line title</li>
          <li>Describe your problem in detail</li>
          <li>Include your code and any error messages</li>
          <li>Add relevant tags to help others find and answer your question</li>
        </ul>
      </div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. How to implement authentication with Next.js and Firebase?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <div className="border rounded-md overflow-hidden">
            <div className="bg-muted px-3 py-2 border-b flex gap-2">
              <Button type="button" variant="ghost" size="sm">
                Bold
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Italic
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Code
              </Button>
              <Button type="button" variant="ghost" size="sm">
                Link
              </Button>
            </div>
            <Textarea
              id="body"
              placeholder="Describe your problem in detail. Include your code and any error messages."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[300px] border-0 focus-visible:ring-0 resize-none"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Supports Markdown. You can use `code`, **bold**, *italic*, and more.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-md">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1 hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="e.g. react, next.js, firebase"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Add up to 5 tags to help others find and answer your question.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch id="anonymous" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
          <Label htmlFor="anonymous">Post anonymously</Label>
        </div>
        <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Your Question"}
        </Button>
      </form>
    </div>
  )
}
