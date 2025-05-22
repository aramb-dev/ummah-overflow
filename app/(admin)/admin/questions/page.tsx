"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { collection, query, orderBy, limit, getDocs, doc, deleteDoc, startAfter, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Search, Loader2, Eye, MessageSquare, ArrowUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Question {
  id: string
  title: string
  authorId: string
  authorName?: string
  tags: string[]
  votes: number
  answersCount: number
  views: number
  createdAt: any
  isAnonymous: boolean
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [tagFilter, setTagFilter] = useState<string>("all")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const PAGE_SIZE = 10

  const fetchQuestions = async (searchTerm = "", tag = "all", startAfterDoc = null) => {
    setLoading(true)
    try {
      let questionsQuery

      if (searchTerm) {
        // Search by question title
        questionsQuery = query(
          collection(db, "questions"),
          where("title", ">=", searchTerm),
          where("title", "<=", searchTerm + "\uf8ff"),
          limit(PAGE_SIZE),
        )
      } else if (tag !== "all") {
        // Filter by tag
        questionsQuery = startAfterDoc
          ? query(
              collection(db, "questions"),
              where("tags", "array-contains", tag),
              orderBy("createdAt", "desc"),
              startAfter(startAfterDoc),
              limit(PAGE_SIZE),
            )
          : query(
              collection(db, "questions"),
              where("tags", "array-contains", tag),
              orderBy("createdAt", "desc"),
              limit(PAGE_SIZE),
            )
      } else {
        // Get all questions with pagination
        questionsQuery = startAfterDoc
          ? query(
              collection(db, "questions"),
              orderBy("createdAt", "desc"),
              startAfter(startAfterDoc),
              limit(PAGE_SIZE),
            )
          : query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(PAGE_SIZE))
      }

      const questionsSnapshot = await getDocs(questionsQuery)
      const questionsList: Question[] = []

      for (const doc of questionsSnapshot.docs) {
        const questionData = doc.data() as Question
        let authorName = "Anonymous"

        if (!questionData.isAnonymous && questionData.authorId) {
          try {
            const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", questionData.authorId)))
            if (!userDoc.empty) {
              authorName = userDoc.docs[0].data().displayName || "Unknown User"
            }
          } catch (error) {
            console.error("Error fetching author:", error)
          }
        }

        questionsList.push({
          id: doc.id,
          ...questionData,
          authorName: questionData.isAnonymous ? "Anonymous" : authorName,
        })
      }

      // Set the last visible document for pagination
      const lastDoc = questionsSnapshot.docs[questionsSnapshot.docs.length - 1]
      setLastVisible(lastDoc)
      setHasMore(questionsSnapshot.docs.length === PAGE_SIZE)

      if (startAfterDoc) {
        setQuestions((prevQuestions) => [...prevQuestions, ...questionsList])
      } else {
        setQuestions(questionsList)
      }
    } catch (error) {
      console.error("Error fetching questions:", error)
      toast({
        title: "Failed to load questions",
        description: "An error occurred while loading the questions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions("", tagFilter)
  }, [tagFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuestions(searchQuery, tagFilter)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchQuestions(searchQuery, tagFilter, lastVisible)
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!user) return

    try {
      // Delete the question
      await deleteDoc(doc(db, "questions", questionId))

      // Remove the question from the state
      setQuestions((prevQuestions) => prevQuestions.filter((question) => question.id !== questionId))

      toast({
        title: "Question deleted",
        description: "The question has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting question:", error)
      toast({
        title: "Failed to delete question",
        description: "An error occurred while deleting the question. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Question Management</h1>
        <p className="text-muted-foreground">View and manage all questions on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Questions</CardTitle>
          <CardDescription>Browse and manage questions from all users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search questions..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <Select value={tagFilter} onValueChange={setTagFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  <SelectItem value="react">React</SelectItem>
                  <SelectItem value="next.js">Next.js</SelectItem>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="typescript">TypeScript</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && questions.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No questions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Question</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Stats</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{question.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {question.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="rounded-md">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{question.authorName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ArrowUp className="h-4 w-4 text-muted-foreground" />
                              <span>{question.votes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>{question.answersCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span>{question.views}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {question.createdAt ? new Date(question.createdAt.toDate()).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`/questions/${question.id}`, "_blank")}
                            >
                              View
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-500">
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete this question and all its answers. This action cannot
                                    be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteQuestion(question.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {hasMore && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
