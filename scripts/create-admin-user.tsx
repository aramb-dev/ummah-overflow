"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/context/auth-context"
import { AlertCircle, Check } from "lucide-react"

export default function CreateAdminUser() {
  const { user } = useAuth()
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const createAdminUser = async () => {
    if (!user) {
      setError("You must be logged in to create an admin user")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Create or update the user document with admin role
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Admin User",
          username: user.displayName?.toLowerCase().replace(/\s+/g, "") || `admin${user.uid.substring(0, 6)}`,
          photoURL: user.photoURL || null,
          role: "admin", // This is the important part - setting the role to admin
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          reputation: 0,
          badges: {
            gold: 0,
            silver: 0,
            bronze: 0,
          },
        },
        { merge: true },
      ) // merge: true will update existing fields and add new ones

      setSuccess(`Admin user created successfully for ${user.email}`)
    } catch (err: any) {
      console.error("Error creating admin user:", err)
      setError(`Error creating admin user: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-10 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin User</CardTitle>
          <CardDescription>Set up the currently logged-in user as an admin</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 text-green-500 mb-4">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Current User:</p>
              <div className="p-3 bg-muted rounded-md">
                <p>
                  <strong>Email:</strong> {user?.email || "Not logged in"}
                </p>
                <p>
                  <strong>Name:</strong> {user?.displayName || "N/A"}
                </p>
                <p>
                  <strong>UID:</strong> {user?.uid || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createAdminUser} disabled={loading || !user} className="w-full">
            {loading ? "Creating..." : "Make Current User Admin"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
