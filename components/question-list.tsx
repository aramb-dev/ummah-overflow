"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, where, doc, getDoc } from "firebase/firestore"
import { db } from "@/firebase"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUp, MessageSquare } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

interface QuestionListProps {
  limit?: number
  userId?: string
  tag?: string
}

export const QuestionList: React.FC<QuestionListProps> = ({ limit, userId, tag }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [userId, limit, tag])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      let questionsQuery

      if (userId) {
        questionsQuery = query(collection(db, "questions"), where("userId", "==", userId), orderBy("createdAt", "desc"))
      } else if (tag) {
        questionsQuery = query(
          collection(db, "questions"),
          where("tags", "array-contains", tag),
          orderBy("createdAt", "desc"),
        )
      } else {
        questionsQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"))
      }

      if (limit) {
        questionsQuery = query(questionsQuery, limit)
      }

      const querySnapshot = await getDocs(questionsQuery)
      const questionsList = []

      for (const docSnapshot of querySnapshot.docs) {
        const questionData = { id: docSnapshot.id, ...docSnapshot.data() }

        // Fetch user data for each question
        const userDoc = await getDoc(doc(db, "users", questionData.userId))
        const userData = userDoc.exists() ? userDoc.data() : null

        questionsList.push({
          ...questionData,
          user: userData,
        })
      }

      setQuestions(questionsList)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-8">Loading questions...</div>
  }

  if (questions.length === 0) {
    return <div className="text-center p-8">No questions found.</div>
  }

  // Sample data structure for development/preview
  const sampleQuestions = [
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
  ]

  // Use sample data for preview/development
  const displayQuestions = questions.length > 0 ? questions : sampleQuestions

  return (
    <div className="space-y-4">
      {displayQuestions.map((question: any) => (
        <Card key={question.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex flex-col items-center rounded-md border px-2 py-1.5">
                  <ArrowUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{question.votes || 0}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs">{question.answers || 0}</span>
                </div>
              </div>
              <div className="flex-1">
                <Link href={`/questions/${question.id}`} className="hover:underline">
                  <h2 className="text-xl font-semibold mb-2">{question.title}</h2>
                </Link>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags &&
                    question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-md">
                        {tag}
                      </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Asked {new Date(question.createdAt).toLocaleDateString()}</span>
                    {question.hijriDate && <span className="text-xs">({question.hijriDate})</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <UserAvatar
                      username={question.author?.name || question.user?.displayName || "Anonymous"}
                      user={
                        question.author?.isAnonymous || !question.user
                          ? null
                          : {
                              displayName: question.author?.name || question.user?.displayName,
                              email: question.author?.email || question.user?.email,
                            }
                      }
                      isAnonymous={question.author?.isAnonymous || !question.user}
                      size="sm"
                    />
                    <span className="text-sm">
                      {question.author?.name || question.user?.displayName || "Anonymous"}
                    </span>
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

// Also include a default export for backward compatibility
export default QuestionList
