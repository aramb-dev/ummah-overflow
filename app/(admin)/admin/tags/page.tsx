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

interface Tag {
  id: string
  name: string
  description: string
  count: number
  createdAt: any
  createdBy: string
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const [newTagName, setNewTagName] = useState("")
  const [newTagDescription, setNewTagDescription] = useState("")
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const PAGE_SIZE = 20

  const fetchTags = async (searchTerm = "", startAfterDoc = null) => {
    setLoading(true)
    try {
      let tagsQuery

      if (searchTerm) {
        // Search by tag name
        tagsQuery = query(
          collection(db, "tags"),
          where("name", ">=", searchTerm),
          where("name", "<=", searchTerm + "\uf8ff"),
          limit(PAGE_SIZE),
        )
      } else {
        // Get all tags with pagination
        tagsQuery = startAfterDoc
          ? query(collection(db, "tags"), orderBy("name"), startAfter(startAfterDoc), limit(PAGE_SIZE))
          : query(collection(db, "tags"), orderBy("name"), limit(PAGE_SIZE))
      }

      const tagsSnapshot = await getDocs(tagsQuery)
      const tagsList: Tag[] = []

      tagsSnapshot.forEach((doc) => {
        tagsList.push({ id: doc.id, ...doc.data() } as Tag)
      })

      // Set the last visible document for pagination
      const lastDoc = tagsSnapshot.docs[tagsSnapshot.docs.length - 1]
      setLastVisible(lastDoc)
      setHasMore(tagsSnapshot.docs.length === PAGE_SIZE)

      if (startAfterDoc) {
        setTags((prevTags) => [...prevTags, ...tagsList])
      } else {
        setTags(tagsList)
      }
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Failed to load tags",
        description: "An error occurred while loading the tags. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTags()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTags(searchQuery)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchTags(searchQuery, lastVisible)
    }
  }

  const handleCreateTag = async () => {
    if (!user) return

    if (!newTagName.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for the tag.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if tag already exists
      const tagQuery = query(collection(db, "tags"), where("name", "==", newTagName.trim().toLowerCase()))
      const tagSnapshot = await getDocs(tagQuery)

      if (!tagSnapshot.empty) {
        toast({
          title: "Tag already exists",
          description: "A tag with this name already exists.",
          variant: "destructive",
        })
        return
      }

      // Create the new tag
      const newTag = {
        name: newTagName.trim().toLowerCase(),
        description: newTagDescription.trim(),
        count: 0,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      }

      const docRef = await addDoc(collection(db, "tags"), newTag)

      // Add the new tag to the state
      setTags((prevTags) => [...prevTags, { id: docRef.id, ...newTag, createdAt: new Date() } as Tag])

      // Reset form and close dialog
      setNewTagName("")
      setNewTagDescription("")
      setIsDialogOpen(false)

      toast({
        title: "Tag created",
        description: "The tag has been created successfully.",
      })
    } catch (error) {
      console.error("Error creating tag:", error)
      toast({
        title: "Failed to create tag",
        description: "An error occurred while creating the tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditTag = async () => {
    if (!user || !editingTag) return

    if (!editingTag.name.trim()) {
      toast({
        title: "Tag name required",
        description: "Please enter a name for the tag.",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if tag name already exists (if it was changed)
      if (editingTag.name !== tags.find((t) => t.id === editingTag.id)?.name) {
        const tagQuery = query(collection(db, "tags"), where("name", "==", editingTag.name.trim().toLowerCase()))
        const tagSnapshot = await getDocs(tagQuery)

        if (!tagSnapshot.empty) {
          toast({
            title: "Tag already exists",
            description: "A tag with this name already exists.",
            variant: "destructive",
          })
          return
        }
      }

      // Update the tag
      await updateDoc(doc(db, "tags", editingTag.id), {
        name: editingTag.name.trim().toLowerCase(),
        description: editingTag.description.trim(),
      })

      // Update the tag in the state
      setTags((prevTags) => prevTags.map((tag) => (tag.id === editingTag.id ? { ...tag, ...editingTag } : tag)))

      // Close dialog
      setIsEditDialogOpen(false)
      setEditingTag(null)

      toast({
        title: "Tag updated",
        description: "The tag has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating tag:", error)
      toast({
        title: "Failed to update tag",
        description: "An error occurred while updating the tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = async (tagId: string) => {
    if (!user) return

    try {
      // Delete the tag
      await deleteDoc(doc(db, "tags", tagId))

      // Remove the tag from the state
      setTags((prevTags) => prevTags.filter((tag) => tag.id !== tagId))

      toast({
        title: "Tag deleted",
        description: "The tag has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Failed to delete tag",
        description: "An error occurred while deleting the tag. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tag Management</h1>
        <p className="text-muted-foreground">Create, edit, and manage tags for categorizing questions</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage the tags used to categorize questions on the platform.</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Tag</DialogTitle>
                  <DialogDescription>Add a new tag to categorize questions.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Tag Name</Label>
                    <Input
                      id="tag-name"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="e.g. react, next.js, firebase"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tag-description">Description</Label>
                    <Textarea
                      id="tag-description"
                      value={newTagDescription}
                      onChange={(e) => setNewTagDescription(e.target.value)}
                      placeholder="Describe what this tag is used for..."
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateTag}>Create Tag</Button>
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
                placeholder="Search tags..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>

          {loading && tags.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tags found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tag</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Questions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tags.map((tag) => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <Badge variant="secondary" className="rounded-md">
                            {tag.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{tag.description}</TableCell>
                        <TableCell>{tag.count}</TableCell>
                        <TableCell>
                          {tag.createdAt
                            ? typeof tag.createdAt.toDate === "function"
                              ? new Date(tag.createdAt.toDate()).toLocaleDateString()
                              : new Date(tag.createdAt).toLocaleDateString()
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Dialog
                              open={isEditDialogOpen && editingTag?.id === tag.id}
                              onOpenChange={(open) => {
                                setIsEditDialogOpen(open)
                                if (!open) setEditingTag(null)
                              }}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingTag(tag)
                                    setIsEditDialogOpen(true)
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Edit Tag</DialogTitle>
                                  <DialogDescription>Update the tag details.</DialogDescription>
                                </DialogHeader>
                                {editingTag && (
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-tag-name">Tag Name</Label>
                                      <Input
                                        id="edit-tag-name"
                                        value={editingTag.name}
                                        onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="edit-tag-description">Description</Label>
                                      <Textarea
                                        id="edit-tag-description"
                                        value={editingTag.description}
                                        onChange={(e) => setEditingTag({ ...editingTag, description: e.target.value })}
                                        rows={4}
                                      />
                                    </div>
                                  </div>
                                )}
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleEditTag}>Save Changes</Button>
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
                                    This will delete the "{tag.name}" tag. This action cannot be undone.
                                    {tag.count > 0 && (
                                      <span className="block mt-2 font-semibold text-red-500">
                                        Warning: This tag is used in {tag.count} questions. Deleting it will remove the
                                        tag from all questions.
                                      </span>
                                    )}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteTag(tag.id)}
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
