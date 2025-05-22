"use client"

import { ArrowUp, ArrowDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FlagButton } from "@/components/moderation/flag-button"

interface AnswerItemProps {
  answer: {
    id: string
    body: string
    votes: number
    isAccepted: boolean
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

export function AnswerItem({ answer, onVote }: AnswerItemProps) {
  return (
    <div
      className={`grid grid-cols-[auto,1fr] gap-4 pb-8 ${answer.isAccepted ? "bg-green-50/10 p-4 rounded-md border border-green-200/20" : ""}`}
    >
      <div className="flex flex-col items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => onVote(1)} className="h-8 w-8">
          <ArrowUp className="h-4 w-4" />
        </Button>
        <span className="font-medium">{answer.votes}</span>
        <Button variant="ghost" size="icon" onClick={() => onVote(-1)} className="h-8 w-8">
          <ArrowDown className="h-4 w-4" />
        </Button>
        {answer.isAccepted && (
          <div className="text-green-500 mt-2" title="Accepted answer">
            <Check className="h-6 w-6" />
          </div>
        )}
      </div>
      <div>
        <div className="prose dark:prose-invert max-w-none mb-4">
          <div dangerouslySetInnerHTML={{ __html: answer.body.replace(/\n/g, "<br>") }} />
        </div>
        <div className="flex justify-between items-center">
          <FlagButton contentId={answer.id} contentType="answer" />
          <div className="flex items-center gap-2 bg-muted/30 p-3 rounded-md">
            <div className="text-sm text-muted-foreground">Answered by</div>
            <Avatar>
              <AvatarImage src={answer.author.avatar || "/placeholder.svg"} alt={answer.author.name} />
              <AvatarFallback>{answer.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{answer.author.name}</div>
              <div className="text-xs text-muted-foreground">
                {answer.author.reputation.toLocaleString()} reputation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
