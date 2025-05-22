"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import type { Flag, FlagStatus } from "@/lib/types"

export function ModerationDashboard() {
  const [flags, setFlags] = useState<Flag[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<FlagStatus>("pending")
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchFlags = async (status: FlagStatus) => {
    setLoading(true)
    try {
      const flagsQuery = query(collection(db, "flags"), where("status", "==", status), orderBy("createdAt", "desc"))
      const flagsSnapshot = await getDocs(flagsQuery)
      const flagsList: Flag[] = []

      flagsSnapshot.forEach((doc) => {
        flagsList.push({ id: doc.id, ...doc.data() } as Flag)
      })

      setFlags(flagsList)
    } catch (error) {
      console.error("Error fetching flags:", error)
      toast({
        title: "Failed to load flags",
        description: "An error occurred while loading the flags. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFlags(activeTab)
  }, [activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value as FlagStatus)
  }

  const handleFlagAction = async (flagId: string, action: "approve" | "reject" | "resolve") => {
    if (!user) return

    try {
      const flagRef = doc(db, "flags", flagId)
      const flagDoc = await getDoc(flagRef)

      if (!flagDoc.exists()) {
        toast({
          title: "Flag not found",
          description: "The flag you're trying to moderate no longer exists.",
          variant: "destructive",
        })
        return
      }

      const flagData = flagDoc.data() as Flag

      // Update the flag status
      await updateDoc(flagRef, {
        status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "resolved",
        reviewerId: user.uid,
        reviewedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // If approved, take action on the content
      if (action === "approve") {
        // Get the content that was flagged
        const contentRef = doc(db, flagData.contentType + "s", flagData.contentId)
        const contentDoc = await getDoc(contentRef)

        if (contentDoc.exists()) {
          // Mark the content as flagged
          await updateDoc(contentRef, {
            isFlagged: true,
            flaggedAt: serverTimestamp(),
            flagReason: flagData.reason,
          })
        }
      }

      // If resolved, delete the flag
      if (action === "resolve") {
        await deleteDoc(flagRef)
      }

      // Refresh the flags list
      fetchFlags(activeTab)

      toast({
        title: "Flag moderated",
        description: `The flag has been ${action === "approve" ? "approved" : action === "reject" ? "rejected" : "resolved"}.`,
      })
    } catch (error) {
      console.error("Error moderating flag:", error)
      toast({
        title: "Failed to moderate flag",
        description: "An error occurred while moderating the flag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getFlagReasonText = (reason: string) => {
    switch (reason) {
      case "spam":
        return "Spam"
      case "rude_or_abusive":
        return "Rude or abusive"
      case "low_quality":
        return "Very low quality"
      case "off_topic":
        return "Off-topic"
      case "needs_improvement":
        return "Needs improvement"
      case "plagiarism":
        return "Plagiarism"
      case "other":
        return "Other"
      default:
        return reason
    }
  }

  const getContentTypeText = (type: string) => {
    switch (type) {
      case "question":
        return "Question"
      case "answer":
        return "Answer"
      case "comment":
        return "Comment"
      default:
        return type
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Moderation Dashboard</h1>
          <p className="text-muted-foreground">
            Review and take action on flagged content to maintain community standards.
          </p>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Flags</CardTitle>
                <CardDescription>
                  Review these flags and take appropriate action to maintain community standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : flags.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No pending flags to review.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {flags.map((flag) => (
                      <div key={flag.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{getContentTypeText(flag.contentType)}</Badge>
                              <Badge variant="secondary">{getFlagReasonText(flag.reason)}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(flag.createdAt?.toDate()).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">Content ID:</span> {flag.contentId}
                            </p>
                            {flag.description && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm mt-1 bg-muted/30 p-2 rounded">{flag.description}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                              onClick={() => handleFlagAction(flag.id!, "approve")}
                            >
                              Approve Flag
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleFlagAction(flag.id!, "reject")}>
                              Reject Flag
                            </Button>
                            <Button size="sm" variant="default" onClick={() => handleFlagAction(flag.id!, "resolve")}>
                              Resolve
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="mt-4">
                          <Button variant="link" className="p-0 h-auto text-sm">
                            View Content
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="approved" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Approved Flags</CardTitle>
                <CardDescription>
                  These flags have been approved and action has been taken on the content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : flags.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No approved flags.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {flags.map((flag) => (
                      <div key={flag.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{getContentTypeText(flag.contentType)}</Badge>
                              <Badge variant="secondary">{getFlagReasonText(flag.reason)}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(flag.createdAt?.toDate()).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">Content ID:</span> {flag.contentId}
                            </p>
                            {flag.description && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm mt-1 bg-muted/30 p-2 rounded">{flag.description}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <Button size="sm" variant="default" onClick={() => handleFlagAction(flag.id!, "resolve")}>
                              Resolve
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="mt-4">
                          <Button variant="link" className="p-0 h-auto text-sm">
                            View Content
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rejected" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Rejected Flags</CardTitle>
                <CardDescription>
                  These flags have been reviewed and rejected as not violating community standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : flags.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No rejected flags.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {flags.map((flag) => (
                      <div key={flag.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{getContentTypeText(flag.contentType)}</Badge>
                              <Badge variant="secondary">{getFlagReasonText(flag.reason)}</Badge>
                              <span className="text-sm text-muted-foreground">
                                {new Date(flag.createdAt?.toDate()).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">
                              <span className="font-medium">Content ID:</span> {flag.contentId}
                            </p>
                            {flag.description && (
                              <div className="mt-2">
                                <p className="text-sm font-medium">Description:</p>
                                <p className="text-sm mt-1 bg-muted/30 p-2 rounded">{flag.description}</p>
                              </div>
                            )}
                          </div>
                          <div>
                            <Button size="sm" variant="default" onClick={() => handleFlagAction(flag.id!, "resolve")}>
                              Resolve
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <div className="mt-4">
                          <Button variant="link" className="p-0 h-auto text-sm">
                            View Content
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
