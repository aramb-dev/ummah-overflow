"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  startAfter,
  where,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { Search, Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"

interface Topic {
  id: string
  name: string
  description: string
  slug: string
  isActive: boolean
  order: number
  createdAt: any
  createdBy: string
}

export default function AdminTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true,
    order: 0,
  })
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const PAGE_SIZE = 20

  const fetchTopics = async (searchTerm = "", startAfterDoc = null) => {
    setLoading(true)
    try {
      let topicsQuery

      if (searchTerm) {
        // Search by topic name
        topicsQuery = query(
          collection(db, "topics"),
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
          limit(PAGE_SIZE),
        )
      } else {
        // Get all topics with pagination
        topicsQuery = startAfterDoc
          ? query(collection(db, "topics"), orderBy("order"), startAfter(startAfterDoc), limit(PAGE_SIZE))
          : query(collection(db, "topics"), orderBy("order"), limit(PAGE_SIZE))
      }

      const topicsSnapshot = await getDocs(topicsQuery)
      const topicsList: Topic[] = []

      topicsSnapshot.forEach((doc) => {
        topicsList.push({ id: doc.id, ...doc.data() } as Topic)
      })

      // Set the last visible document for pagination
      const lastDoc = topicsSnapshot.docs[topicsSnapshot.docs.length - 1]
      setLastVisible(lastDoc)
      setHasMore(topicsSnapshot.docs.length === PAGE_SIZE)

      if (startAfterDoc) {
        setTopics((prevTopics) => [...prevTopics, ...topicsList])
      } else {
        setTopics(topicsList)
      }
    } catch (error) {
      console.error("Error fetching topics:", error)
      toast({
        title: "Failed to load topics",
        description: "An error occurred while loading the topics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTopics(searchQuery)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchTopics(searchQuery, lastVisible)
    }
  }

  const createSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleCreateTopic = async () => {
    if (!user) return

    if (!newTopic.name.trim()) {
      toast({
        title: "Topic name required",
        description: "Please enter a name for the topic.",
        variant: "destructive",
      })
      return
    }

    try {
      // Generate slug if not provided
      const slug = newTopic.slug.trim() || createSlug(newTopic.name)

      // Check if slug already exists
      const slugQuery = query(collection(db, "topics"), where("slug", "==", slug))
      const slugSnapshot = await getDocs(slugQuery)

      if (!slugSnapshot.empty) {
        toast({
          title: "Slug already exists",
          description: "A topic with this slug already exists. Please use a different name or provide a custom slug.",
          variant: "destructive",
        })
        return
      }

      // Get the highest order to place the new topic at the end
      let highestOrder = 0
      if (topics.length > 0) {
        highestOrder = Math.max(...topics.map((topic) => topic.order)) + 1
      }

      // Create the new topic
      const topicData = {
        name: newTopic.name.trim(),
        description: newTopic.description.trim(),
        slug,
        isActive: newTopic.isActive,
        order: newTopic.order || highestOrder,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      }

      const docRef = await addDoc(collection(db, "topics"), topicData)

      // Add the new topic to the state
      setTopics((prevTopics) => [...prevTopics, { id: docRef.id, ...topicData, createdAt: new Date() } as Topic])

      // Reset form and close dialog
      setNewTopic({
        name: "",
        description: "",
        slug: "",
        isActive: true,
        order: 0,
      })
      setIsDialogOpen(false)

      toast({
        title: "Topic created",
        description: "The topic has been created successfully.",
      })
    } catch (error) {
      console.error("Error creating topic:", error)
      toast({
        title: "Failed to create topic",
        description: "An error occurred while creating the topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTopic = async () => {
    if (!user || !editingTopic) return

    if (!editingTopic.name.trim()) {
      toast({
        title: "Topic name required",
        description: "Please enter a name for the topic.",
        variant: "destructive",
      })
      return
    }

    try {
      // Generate slug if not provided
      const slug = editingTopic.slug.trim() || createSlug(editingTopic.name)

      // Check if slug already exists (if it was changed)
      if (slug !== topics.find((t) => t.id === editingTopic.id)?.slug) {
        const slugQuery = query(collection(db, "topics"), where("slug", "==", slug))
        const slugSnapshot = await getDocs(slugQuery)

        if (!slugSnapshot.empty) {
          toast({
            title: "Slug already exists",
            description: "A topic with this slug already exists. Please use a different name or provide a custom slug.",
            variant: "destructive",
          })
          return
        }
      }

      // Update the topic
      await updateDoc(doc(db, "topics", editingTopic.id), {
        name: editingTopic.name.trim(),
        description: editingTopic.description.trim(),
        slug,
        isActive: editingTopic.isActive,
        order: editingTopic.order,
      })

      // Update the topic in the state
      setTopics((prevTopics) =>
        prevTopics.map((topic) => (topic.id === editingTopic.id ? { ...topic, ...editingTopic, slug } : topic)),
      )

      // Close dialog
      setIsEditDialogOpen(false)
      setEditingTopic(null)

      toast({
        title: "Topic updated",
        description: "The topic has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating topic:", error)
      toast({
        title: "Failed to update topic",
        description: "An error occurred while updating the topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    if (!user) return

    try {
      // Delete the topic
      await deleteDoc(doc(db, "topics", topicId))

      // Remove the topic from the state
      setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== topicId))

      toast({
        title: "Topic deleted",
        description: "The topic has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting topic:", error)
      toast({
        title: "Failed to delete topic",
        description: "An error occurred while deleting the topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (topicId: string, isActive: boolean) => {
    if (!user) return

    try {
      // Update the topic's active status
      await updateDoc(doc(db, "topics", topicId), {
        isActive,
      })

      // Update the topic in the state
      setTopics((prevTopics) => prevTopics.map((topic) => (topic.id === topicId ? { ...topic, isActive } : topic)))

      toast({
        title: isActive ? "Topic activated" : "Topic deactivated",
        description: `The topic has been ${isActive ? "activated" : "deactivated"} successfully.`,
      })
    } catch (error) {
      console.error("Error updating topic status:", error)
      toast({
        title: "Failed to update topic",
        description: "An error occurred while updating the topic. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Topic Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage topics for organizing content</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Topics</CardTitle>
              <CardDescription>Manage the topics used to organize content on the platform.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Topic
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Topic</DialogTitle>
                  <DialogDescription>Add a new topic to organize content.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic-name">Topic Name</Label>
                    <Input
                      id="topic-name"
                      value={newTopic.name}
                      onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                      placeholder="e.g. Programming, Design, DevOps"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-slug">Slug (Optional)</Label>
                    <Input
                      id="topic-slug"
                      value={newTopic.slug}
                      onChange={(e) => setNewTopic({ ...newTopic, slug: e.target.value })}
                      placeholder="e.g. programming, design, devops"
                    />
                    <p className="text-xs text-muted-foreground">Leave blank to auto-generate from the topic name.</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-description">Description</Label>
                    <Textarea
                      id="topic-description"
                      value={newTopic.description}
                      onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                      placeholder="Describe what this topic is about..."
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topic-order">Display Order</Label>
                    <Input
                      id="topic-order"
                      type="number"
                      value={newTopic.order.toString()}
                      onChange={(e) => setNewTopic({ ...newTopic, order: Number.parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      Topics are displayed in ascending order. Leave as 0 to add to the end.
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="topic-active"
                      checked={newTopic.isActive}
                      onCheckedChange={(checked) => setNewTopic({ ...newTopic, isActive: checked })}
                    />
                    <Label htmlFor="topic-active">Active</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTopic}>Create Topic</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search topics..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {loading && topics.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No topics found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topics.map((topic) => (
                      <TableRow key={topic.id}>
                        <TableCell>{topic.order}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{topic.name}</div>
                            <div className="text-sm text-muted-foreground truncate max-w-xs">{topic.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>{topic.slug}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              topic.isActive
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-red-500/10 text-red-500 border-red-500/20"
                            }
                          >
                            {topic.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {topic.createdAt ? new Date(topic.createdAt.toDate()).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(topic.id, !topic.isActive)}
                            >
                              {topic.isActive ? "Deactivate" : "Activate"}
                            </Button>

                            <Dialog
                              open={isEditDialogOpen && editingTopic?.id === topic.id}
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open)
                                if (!open) setEditingTopic(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingTopic(topic)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Topic</DialogTitle>
                                  <DialogDescription>Update the topic details.</DialogDescription>
                                </DialogHeader>
                                {editingTopic && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-topic-name">Topic Name</Label>
                                      <Input
                                        id="edit-topic-name"
                                        value={editingTopic.name}
                                        onChange={(e) => setEditingTopic({ ...editingTopic, name: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-topic-slug">Slug</Label>
                                      <Input
                                        id="edit-topic-slug"
                                        value={editingTopic.slug}
                                        onChange={(e) => setEditingTopic({ ...editingTopic, slug: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-topic-description">Description</Label>
                                      <Textarea
                                        id="edit-topic-description"
                                        value={editingTopic.description}
                                        onChange={(e) =>
                                          setEditingTopic({ ...editingTopic, description: e.target.value })
                                        }
                                        rows={4}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-topic-order">Display Order</Label>
                                      <Input
                                        id="edit-topic-order"
                                        type="number"
                                        value={editingTopic.order.toString()}
                                        onChange={(e) =>
                                          setEditingTopic({
                                            ...editingTopic,
                                            order: Number.parseInt(e.target.value) || 0,
                                          })
                                        }
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        id="edit-topic-active"
                                        checked={editingTopic.isActive}
                                        onCheckedChange={(checked) =>
                                          setEditingTopic({ ...editingTopic, isActive: checked })
                                        }
                                      />
                                      <Label htmlFor="edit-topic-active">Active</Label>
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditTopic}>Save Changes</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-500">
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will delete the "{topic.name}" topic. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTopic(topic.id)}
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
