"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  where,
  startAfter,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import type { User, UserRole } from "@/lib/types"
import { Search } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const PAGE_SIZE = 10

  const fetchUsers = async (searchTerm = "", startAfterDoc = null) => {
    if (!currentUser) return

    setLoading(true)
    try {
      let usersQuery

      if (searchTerm) {
        // Search by displayName or email
        usersQuery = query(
          collection(db, "users"),
          where("displayName", ">=", searchTerm),
          where("displayName", "<=", searchTerm + "\uf8ff"),
          limit(PAGE_SIZE),
        )
      } else {
        // Get all users with pagination
        usersQuery = startAfterDoc
          ? query(collection(db, "users"), orderBy("createdAt", "desc"), startAfter(startAfterDoc), limit(PAGE_SIZE))
          : query(collection(db, "users"), orderBy("createdAt", "desc"), limit(PAGE_SIZE))
      }

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
      } else {
        setUsers(usersList)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Failed to load users",
        description: "An error occurred while loading the users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(searchQuery)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchUsers(searchQuery, lastVisible)
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!currentUser) return

    try {
      // Check if the user is trying to change their own role
      if (userId === currentUser.uid) {
        toast({
          title: "Cannot change own role",
          description: "You cannot change your own role.",
          variant: "destructive",
        })
        return
      }

      // Check if the current user is an admin
      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (!currentUserDoc.exists() || currentUserDoc.data().role !== "admin") {
        toast({
          title: "Permission denied",
          description: "Only administrators can change user roles.",
          variant: "destructive",
        })
        return
      }

      // Update the user's role
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      })

      // Update the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.uid === userId ? { ...user, role: newRole } : user)))

      toast({
        title: "Role updated",
        description: `User role has been updated to ${newRole}.`,
      })
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Failed to update role",
        description: "An error occurred while updating the user role. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleBanUser = async (userId: string, isBanned: boolean) => {
    if (!currentUser) return

    try {
      // Check if the user is trying to ban themselves
      if (userId === currentUser.uid) {
        toast({
          title: "Cannot ban yourself",
          description: "You cannot ban your own account.",
          variant: "destructive",
        })
        return
      }

      // Check if the current user is an admin or moderator
      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (
        !currentUserDoc.exists() ||
        (currentUserDoc.data().role !== "admin" && currentUserDoc.data().role !== "moderator")
      ) {
        toast({
          title: "Permission denied",
          description: "Only administrators and moderators can ban users.",
          variant: "destructive",
        })
        return
      }

      // Update the user's ban status
      await updateDoc(doc(db, "users", userId), {
        isBanned: isBanned,
        bannedUntil: isBanned ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // Ban for 30 days
      })

      // Update the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.uid === userId ? { ...user, isBanned } : user)))

      toast({
        title: isBanned ? "User banned" : "User unbanned",
        description: isBanned
          ? "User has been banned for 30 days."
          : "User has been unbanned and can now use the platform.",
      })
    } catch (error) {
      console.error("Error updating user ban status:", error)
      toast({
        title: "Failed to update ban status",
        description: "An error occurred while updating the user ban status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions to maintain community standards.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View and manage all users on the platform. Assign roles and moderate user accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name or email..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            {loading && users.length === 0 ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 gap-4 p-4 font-medium border-b">
                    <div className="col-span-5">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Reputation</div>
                    <div className="col-span-3">Actions</div>
                  </div>
                  {users.map((user) => (
                    <div key={user.uid} className="grid grid-cols-12 gap-4 p-4 items-center border-b last:border-0">
                      <div className="col-span-5">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            username={user.username}
                            user={{
                              displayName: user.displayName,
                              email: user.email,
                            }}
                            size="sm"
                          />
                          <div>
                            <div className="font-medium">{user.displayName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Select
                          defaultValue={user.role}
                          onValueChange={(value) => handleRoleChange(user.uid, value as UserRole)}
                          disabled={user.uid === currentUser?.uid}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{user.reputation.toLocaleString()}</Badge>
                      </div>
                      <div className="col-span-3 flex gap-2">
                        <Button
                          size="sm"
                          variant={user.isBanned ? "default" : "outline"}
                          className={
                            user.isBanned ? "" : "border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                          }
                          onClick={() => handleBanUser(user.uid, !user.isBanned)}
                          disabled={user.uid === currentUser?.uid}
                        >
                          {user.isBanned ? "Unban" : "Ban"}
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/users/${user.uid}`} target="_blank" rel="noopener noreferrer">
                            View Profile
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={handleLoadMore} disabled={loading}>
                      {loading ? "Loading..." : "Load More"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
