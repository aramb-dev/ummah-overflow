"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserAvatar } from "@/components/user-avatar"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { updateUserProfile, type ProfileFormData } from "@/app/actions/update-profile"
import { AlertCircle, Check, Loader2 } from "lucide-react"

interface ProfileSettingsProps {
  user: any
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    displayName: "",
    username: "",
    bio: "",
    location: "",
    website: "",
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          setFormData({
            displayName: userData.displayName || "",
            username: userData.username || "",
            bio: userData.bio || "",
            location: userData.location || "",
            website: userData.website || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setError("Failed to load user data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setUpdating(true)

    try {
      const result = await updateUserProfile(user.uid, formData)

      if (result.success) {
        setSuccess(result.message)
        // Update the user's display name in Firebase Auth
        if (user.displayName !== formData.displayName) {
          // This would be handled in the server action in a real implementation
        }
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile information visible to other users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-500">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
            <div className="flex flex-col items-center gap-2">
              <UserAvatar user={user} username={formData.username} size="xl" />
              <p className="text-xs text-muted-foreground text-center max-w-[150px]">
                Profile picture is generated based on your username
              </p>
            </div>

            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" name="username" value={formData.username} onChange={handleChange} required />
                  <p className="text-xs text-muted-foreground">Only letters, numbers, and underscores</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push(`/users/${user.uid}`)}>
            View Profile
          </Button>
          <Button type="submit" disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
