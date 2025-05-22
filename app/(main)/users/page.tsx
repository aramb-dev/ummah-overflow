"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { collection, query, orderBy, limit, getDocs, startAfter } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Search, Loader2 } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import type { User } from "@/lib/types"

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const PAGE_SIZE = 20

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async (startAfterDoc = null) => {
    if (startAfterDoc) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const usersQuery = startAfterDoc
        ? query(collection(db, "users"), orderBy("reputation", "desc"), startAfter(startAfterDoc), limit(PAGE_SIZE))
        : query(collection(db, "users"), orderBy("reputation", "desc"), limit(PAGE_SIZE))

      const usersSnapshot = await getDocs(usersQuery)
      const usersList: User[] = []

      usersSnapshot.forEach((doc) => {
        usersList.push({ uid: doc.id, ...doc.data() } as User)
      })

      // Set the last visible document for pagination
      const lastDoc = usersSnapshot.docs[usersSnapshot.docs.length - 1]
      setLastVisible(lastDoc)
      setHasMore(usersSnapshot.docs.length === PAGE_SIZE)

      if (startAfterDoc) {
        setUsers((prevUsers) => [...prevUsers, ...usersList])
        setFilteredUsers((prevUsers) => [...prevUsers, ...usersList])
      } else {
        setUsers(usersList)
        setFilteredUsers(usersList)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Failed to load users",
        description: "An error occurred while loading the users. Please try again.",
        variant: "destructive",
      })
    } finally {
      if (startAfterDoc) {
        setLoadingMore(false)
      } else {
        setLoading(false)
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setFilteredUsers(users)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = users.filter(
      (user) =>
        user.displayName.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query)),
    )
    setFilteredUsers(filtered)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchUsers(lastVisible)
    }
  }

  return (
    <div className="container py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">Browse all users on UmmahOverflow, sorted by reputation.</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
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
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <Card key={user.uid}>
                  <CardContent className="p-4">
                    <Link
                      href={`/users/${user.uid}`}
                      className="flex items-start gap-4 hover:bg-muted/50 p-2 rounded-md"
                    >
                      <UserAvatar
                        username={user.username}
                        user={{
                          displayName: user.displayName,
                          email: user.email,
                        }}
                        size="md"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{user.displayName}</div>
                        <div className="text-sm text-muted-foreground">@{user.username}</div>
                        {user.bio && <p className="text-sm mt-1 line-clamp-2">{user.bio}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="rounded-full">
                            {user.reputation.toLocaleString()} reputation
                          </Badge>
                          {user.role === "admin" && (
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                              Admin
                            </Badge>
                          )}
                          {user.role === "moderator" && (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                              Moderator
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {hasMore && !searchQuery && (
              <div className="flex justify-center mt-6">
                <Button variant="outline" onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? (
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
          </>
        )}
      </div>
    </div>
  )
}
