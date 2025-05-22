"use client"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FlagButton } from "@/components/moderation/flag-button"

interface QuestionDetailProps {
  question: {
    id: string
    title: string
    body: string
    tags: string[]
    votes: number
    author: {
      name: string
      avatar?: string
      reputation: number
    }
    createdAt: string
    hijriDate: string
  }
  onVote: (value: number) => void
}

export function QuestionDetail({ question, onVote }: QuestionDetailProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">{question.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
          <span className="text-xs">({question.hijriDate})</span>
        </div>
      </div>

      <div className="grid grid-cols-[auto,1fr] gap-4">
        <div className="flex flex-col items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onVote(1)} className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="font-medium">{question.votes}</span>
          <Button variant="ghost" size="icon" onClick={() => onVote(-1)} className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        <div>
          <div className="prose dark:prose-invert max-w-none mb-4">
            <div dangerouslySetInnerHTML={{ __html: question.body.replace(/\n/g, "<br>") }} />
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-md">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <FlagButton contentId={question.id} contentType="question" />
            <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Asked by</div>
              <Avatar>
                <AvatarImage src={question.author.avatar || "/placeholder.svg"} alt={question.author.name} />
                <AvatarFallback>{question.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{question.author.name}</div>
                <div className="text-xs text-muted-foreground">
                  {question.author.reputation.toLocaleString()} reputation
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
