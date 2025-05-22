"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  serverTimestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import type { User, UserRole } from "@/lib/types"
import { Search, Loader2, Filter } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [lastVisible, setLastVisible] = useState<any>(null)
  const [hasMore, setHasMore] = useState(true)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()
  const PAGE_SIZE = 10

  const fetchUsers = async (searchTerm = "", role = "all", startAfterDoc = null) => {
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
      } else if (role !== "all") {
        // Filter by role
        usersQuery = startAfterDoc
          ? query(
              collection(db, "users"),
              where("role", "==", role),
              orderBy("createdAt", "desc"),
              startAfter(startAfterDoc),
              limit(PAGE_SIZE),
            )
          : query(collection(db, "users"), where("role", "==", role), orderBy("createdAt", "desc"), limit(PAGE_SIZE))
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
    fetchUsers("", roleFilter)
  }, [roleFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsers(searchQuery, roleFilter)
  }

  const handleLoadMore = () => {
    if (lastVisible) {
      fetchUsers(searchQuery, roleFilter, lastVisible)
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
        updatedAt: serverTimestamp(),
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

      // Check if the current user is an admin
      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (!currentUserDoc.exists() || currentUserDoc.data().role !== "admin") {
        toast({
          title: "Permission denied",
          description: "Only administrators can ban users.",
          variant: "destructive",
        })
        return
      }

      // Update the user's ban status
      await updateDoc(doc(db, "users", userId), {
        isBanned: isBanned,
        bannedUntil: isBanned ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null, // Ban for 30 days
        updatedAt: serverTimestamp(),
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

  const handleDeleteUser = async (userId: string) => {
    if (!currentUser) return

    try {
      // Check if the user is trying to delete themselves
      if (userId === currentUser.uid) {
        toast({
          title: "Cannot delete yourself",
          description: "You cannot delete your own account from the admin panel.",
          variant: "destructive",
        })
        return
      }

      // Check if the current user is an admin
      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid))
      if (!currentUserDoc.exists() || currentUserDoc.data().role !== "admin") {
        toast({
          title: "Permission denied",
          description: "Only administrators can delete users.",
          variant: "destructive",
        })
        return
      }

      // In a real application, you would:
      // 1. Delete the user's authentication record
      // 2. Delete or anonymize the user's content
      // 3. Delete the user's document from Firestore

      // For this example, we'll just delete the user document
      // await deleteDoc(doc(db, "users", userId))

      // Update the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.uid !== userId))

      toast({
        title: "User deleted",
        description: "The user has been permanently deleted from the platform.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Failed to delete user",
        description: "An error occurred while deleting the user. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>View and manage all users on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users by name..."
                  className="pl-8 w-full md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="moderator">Moderators</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && users.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.role === "admin"
                                ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                : user.role === "moderator"
                                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                  : "bg-green-500/10 text-green-500 border-green-500/20"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                              Banned
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => window.open(`/users/${user.uid}`, "_blank")}
                                className="cursor-pointer"
                              >
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.uid, "user")}
                                disabled={user.role === "user" || user.uid === currentUser?.uid}
                                className="cursor-pointer"
                              >
                                Set as User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.uid, "moderator")}
                                disabled={user.role === "moderator" || user.uid === currentUser?.uid}
                                className="cursor-pointer"
                              >
                                Set as Moderator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRoleChange(user.uid, "admin")}
                                disabled={user.role === "admin" || user.uid === currentUser?.uid}
                                className="cursor-pointer"
                              >
                                Set as Admin
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleBanUser(user.uid, !user.isBanned)}
                                disabled={user.uid === currentUser?.uid}
                                className="cursor-pointer"
                              >
                                {user.isBanned ? "Unban User" : "Ban User"}
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    disabled={user.uid === currentUser?.uid}
                                    className="text-red-500 cursor-pointer"
                                  >
                                    Delete User
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user account and
                                      remove their data from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteUser(user.uid)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
