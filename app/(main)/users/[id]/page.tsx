import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserAvatar } from "@/components/user-avatar"

// Sample user data
const user = {
  id: 1,
  name: "Ahmed Khan",
  username: "ahmedkhan",
  email: "ahmed@example.com",
  bio: "Full-stack developer specializing in React, Next.js, and Node.js. Contributing to open-source projects and helping fellow developers.",
  reputation: 12543,
  badges: {
    gold: 5,
    silver: 24,
    bronze: 78,
  },
  stats: {
    questions: 87,
    answers: 342,
    accepted: 156,
  },
  joinedAt: "2021-03-15T10:30:00Z",
  hijriJoinDate: "1442-08-02",
  location: "Kuala Lumpur, Malaysia",
  website: "https://ahmedkhan.dev",
}

// Sample questions data
const questions = [
  {
    id: 1,
    title: "How to implement authentication with Next.js and Firebase?",
    tags: ["next.js", "firebase", "authentication"],
    votes: 15,
    answers: 3,
    createdAt: "2023-05-15T10:30:00Z",
    hijriDate: "1444-10-25",
  },
  {
    id: 2,
    title: "Best practices for handling API errors in a Next.js application",
    tags: ["next.js", "error-handling", "api"],
    votes: 27,
    answers: 6,
    createdAt: "2023-05-05T11:30:00Z",
    hijriDate: "1444-10-15",
  },
  {
    id: 3,
    title: "How to optimize Docker images for Node.js applications?",
    tags: ["docker", "node.js", "optimization"],
    votes: 24,
    answers: 5,
    createdAt: "2023-04-10T09:15:00Z",
    hijriDate: "1444-09-19",
  },
]

// Sample answers data
const answers = [
  {
    id: 1,
    questionId: 4,
    questionTitle: "Implementing real-time features with Supabase and React",
    isAccepted: true,
    votes: 23,
    createdAt: "2023-05-15T11:45:00Z",
    hijriDate: "1444-10-25",
  },
  {
    id: 2,
    questionId: 5,
    questionTitle: "How to set up a CI/CD pipeline for a Next.js application?",
    isAccepted: false,
    votes: 12,
    createdAt: "2023-05-02T14:20:00Z",
    hijriDate: "1444-10-12",
  },
  {
    id: 3,
    questionId: 6,
    questionTitle: "Best practices for state management in React with large applications",
    isAccepted: true,
    votes: 34,
    createdAt: "2023-04-22T09:30:00Z",
    hijriDate: "1444-10-02",
  },
]

export default function UserProfile({ params }: { params: { id: string } }) {
  return (
    <div className="container py-6">
      <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">
                  <UserAvatar
                    username={user.username}
                    user={{
                      displayName: user.name,
                      email: user.email,
                    }}
                    size="xl"
                  />
                </div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="rounded-full">
                    {user.reputation.toLocaleString()} reputation
                  </Badge>
                </div>
                <div className="flex gap-4 mt-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-500">●</span>
                      <span className="font-medium">{user.badges.gold}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Gold</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-gray-400">●</span>
                      <span className="font-medium">{user.badges.silver}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Silver</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-700">●</span>
                      <span className="font-medium">{user.badges.bronze}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Bronze</span>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium mb-2">About</h2>
                  <p className="text-sm text-muted-foreground">{user.bio}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-muted-foreground">{user.location}</div>
                  </div>
                  <div>
                    <div className="font-medium">Website</div>
                    <a href={user.website} className="text-primary hover:underline truncate block">
                      {user.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                  <div>
                    <div className="font-medium">Joined</div>
                    <div className="text-muted-foreground">
                      {new Date(user.joinedAt).toLocaleDateString()}
                      <span className="text-xs ml-1">({user.hijriJoinDate})</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="font-medium mb-4">Stats</h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">{user.stats.questions}</div>
                  <div className="text-xs text-muted-foreground">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.stats.answers}</div>
                  <div className="text-xs text-muted-foreground">Answers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{user.stats.accepted}</div>
                  <div className="text-xs text-muted-foreground">Accepted</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Tabs defaultValue="questions">
            <TabsList className="mb-4">
              <TabsTrigger value="questions">Questions</TabsTrigger>
              <TabsTrigger value="answers">Answers</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="questions" className="space-y-4">
              {questions.map((question) => (
                <Card key={question.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <Link href={`/questions/${question.id}`} className="hover:underline">
                        <h3 className="font-medium">{question.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{question.votes} votes</span>
                        <span>{question.answers} answers</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {question.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="rounded-md">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Asked {new Date(question.createdAt).toLocaleDateString()}
                      <span className="ml-1">({question.hijriDate})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="answers" className="space-y-4">
              {answers.map((answer) => (
                <Card key={answer.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <Link href={`/questions/${answer.questionId}`} className="hover:underline">
                        <h3 className="font-medium">{answer.questionTitle}</h3>
                      </Link>
                      <div className="flex items-center gap-2">
                        {answer.isAccepted && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Accepted
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">{answer.votes} votes</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Answered {new Date(answer.createdAt).toLocaleDateString()}
                      <span className="ml-1">({answer.hijriDate})</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="activity" className="p-4 bg-muted/30 rounded-md">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">Activity timeline coming soon</h3>
                <p className="text-muted-foreground">
                  We're working on a detailed activity timeline to show all user interactions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
