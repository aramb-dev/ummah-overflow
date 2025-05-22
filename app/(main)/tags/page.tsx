"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { collection, query, orderBy, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Search, Loader2 } from "lucide-react"

interface Tag {
  id: string
  name: string
  description: string
  count: number
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [filteredTags, setFilteredTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true)
      try {
        const tagsQuery = query(collection(db, "tags"), orderBy("name"))
        const tagsSnapshot = await getDocs(tagsQuery)
        const tagsList: Tag[] = []

        tagsSnapshot.forEach((doc) => {
          tagsList.push({ id: doc.id, ...doc.data() } as Tag)
        })

        setTags(tagsList)
        setFilteredTags(tagsList)
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

    fetchTags()
  }, [toast])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredTags(tags)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = tags.filter(
      (tag) => tag.name.toLowerCase().includes(query) || tag.description.toLowerCase().includes(query),
    )
    setFilteredTags(filtered)
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Tags</h1>
          <p className="text-muted-foreground">Browse all tags used to categorize questions on UmmahOverflow.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
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

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tags found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTags.map((tag) => (
              <Card key={tag.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Link href={`/tags/${tag.name}`}>
                        <Badge variant="secondary" className="rounded-md text-base px-3 py-1 hover:bg-secondary/80">
                          {tag.name}
                        </Badge>
                      </Link>
                      <span className="text-sm text-muted-foreground">{tag.count} questions</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{tag.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
