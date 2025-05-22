import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MessageSquare } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

// Sample data for questions
const questions = [
  {
    id: 1,
    title: "How to implement authentication with Next.js and Firebase?",
    tags: ["next.js", "firebase", "authentication"],
    votes: 15,
    answers: 3,
    author: {
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      isAnonymous: false,
    },
    createdAt: "2023-05-15T10:30:00Z",
    hijriDate: "1444-10-25",
  },
  {
    id: 2,
    title: "Best practices for state management in React with large applications",
    tags: ["react", "state-management", "redux", "context-api"],
    votes: 32,
    answers: 7,
    author: {
      name: "Fatima Ali",
      email: "fatima@example.com",
      isAnonymous: false,
    },
    createdAt: "2023-05-12T14:20:00Z",
    hijriDate: "1444-10-22",
  },
  {
    id: 3,
    title: "How to optimize Docker images for Node.js applications?",
    tags: ["docker", "node.js", "optimization"],
    votes: 24,
    answers: 5,
    author: {
      name: "Anonymous",
      isAnonymous: true,
    },
    createdAt: "2023-05-10T09:15:00Z",
    hijriDate: "1444-10-20",
  },
  {
    id: 4,
    title: "Implementing real-time features with Supabase and React",
    tags: ["supabase", "react", "real-time"],
    votes: 18,
    answers: 2,
    author: {
      name: "Omar Farooq",
      email: "omar@example.com",
      isAnonymous: false,
    },
    createdAt: "2023-05-08T16:45:00Z",
    hijriDate: "1444-10-18",
  },
  {
    id: 5,
    title: "Best practices for handling API errors in a Next.js application",
    tags: ["next.js", "error-handling", "api"],
    votes: 27,
    answers: 6,
    author: {
      name: "Aisha Rahman",
      email: "aisha@example.com",
      isAnonymous: false,
    },
    createdAt: "2023-05-05T11:30:00Z",
    hijriDate: "1444-10-15",
  },
]

export function QuestionList() {
  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex flex-col items-center rounded-md border px-2 py-1.5">
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{question.votes}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{question.answers}</span>
                </div>
              </div>
              <div className="flex-1">
                <Link href={`/questions/${question.id}`} className="hover:underline">
                  <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-md">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                    <span className="text-xs">({question.hijriDate})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      username={question.author.name}
                      user={
                        question.author.isAnonymous
                          ? null
                          : {
                              displayName: question.author.name,
                              email: question.author.email,
                            }
                      }
                      isAnonymous={question.author.isAnonymous}
                      size="sm"
                    />
                    <span className="text-sm">{question.author.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
