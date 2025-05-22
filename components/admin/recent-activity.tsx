"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Flag, User, Tag } from "lucide-react"

// Sample data - in a real app, this would come from your database
const activities = [
  {
    id: 1,
    type: "question",
    user: {
      name: "Ahmed Khan",
      avatar: "/placeholder.svg",
    },
    content: "Posted a new question: 'How to implement authentication with Next.js and Firebase?'",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "answer",
    user: {
      name: "Fatima Ali",
      avatar: "/placeholder.svg",
    },
    content: "Answered a question: 'Best practices for state management in React with large applications'",
    time: "3 hours ago",
  },
  {
    id: 3,
    type: "flag",
    user: {
      name: "Omar Farooq",
      avatar: "/placeholder.svg",
    },
    content: "Flagged a question as 'off-topic'",
    time: "5 hours ago",
  },
  {
    id: 4,
    type: "user",
    user: {
      name: "System",
      avatar: "/placeholder.svg",
    },
    content: "New user registered: Aisha Rahman",
    time: "6 hours ago",
  },
  {
    id: 5,
    type: "tag",
    user: {
      name: "Yusuf Ibrahim",
      avatar: "/placeholder.svg",
    },
    content: "Created a new tag: 'react-server-components'",
    time: "8 hours ago",
  },
]

export function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "question":
      case "answer":
        return <MessageSquare className="h-4 w-4" />
      case "flag":
        return <Flag className="h-4 w-4" />
      case "user":
        return <User className="h-4 w-4" />
      case "tag":
        return <Tag className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getActivityBadge = (type: string) => {
    switch (type) {
      case "question":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Question
          </Badge>
        )
      case "answer":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Answer
          </Badge>
        )
      case "flag":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
            Flag
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            User
          </Badge>
        )
      case "tag":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            Tag
          </Badge>
        )
      default:
        return <Badge variant="outline">Activity</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>The latest activity across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 rounded-lg border p-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{activity.user.name}</p>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground">{activity.content}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
