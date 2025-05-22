"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Check, Loader2 } from "lucide-react"

interface NotificationSettingsProps {
  user: any
}

export function NotificationSettings({ user }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    questionAnswers: true,
    mentions: true,
    upvotes: true,
    comments: true,
    directMessages: true,
    weeklyDigest: false,
    systemAnnouncements: true,
  })

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      if (!user?.uid) return

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists() && userDoc.data().notificationSettings) {
          setSettings((prev) => ({
            ...prev,
            ...userDoc.data().notificationSettings,
          }))
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotificationSettings()
  }, [user])

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess("")
    setUpdating(true)

    try {
      await updateDoc(doc(db, "users", user.uid), {
        notificationSettings: settings,
        updatedAt: serverTimestamp(),
      })

      setSuccess("Notification settings updated successfully")
    } catch (error) {
      console.error("Error updating notification settings:", error)
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
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Manage how and when you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <Alert className="border-green-500 text-green-500">
              <Check className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications" className="font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={() => handleToggle("emailNotifications")}
              />
            </div>

            <div className="ml-6 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="questionAnswers">When someone answers my question</Label>
                <Switch
                  id="questionAnswers"
                  checked={settings.questionAnswers}
                  onCheckedChange={() => handleToggle("questionAnswers")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="mentions">When someone mentions me</Label>
                <Switch
                  id="mentions"
                  checked={settings.mentions}
                  onCheckedChange={() => handleToggle("mentions")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="upvotes">When my content receives upvotes</Label>
                <Switch
                  id="upvotes"
                  checked={settings.upvotes}
                  onCheckedChange={() => handleToggle("upvotes")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="comments">When someone comments on my content</Label>
                <Switch
                  id="comments"
                  checked={settings.comments}
                  onCheckedChange={() => handleToggle("comments")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="directMessages">When I receive a direct message</Label>
                <Switch
                  id="directMessages"
                  checked={settings.directMessages}
                  onCheckedChange={() => handleToggle("directMessages")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="weeklyDigest">Weekly digest of top questions</Label>
                <Switch
                  id="weeklyDigest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={() => handleToggle("weeklyDigest")}
                  disabled={!settings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="systemAnnouncements">System announcements</Label>
                <Switch
                  id="systemAnnouncements"
                  checked={settings.systemAnnouncements}
                  onCheckedChange={() => handleToggle("systemAnnouncements")}
                  disabled={!settings.emailNotifications}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={updating}>
            {updating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
